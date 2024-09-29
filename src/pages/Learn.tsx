// import Header from "../components/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
import { Navigate, useBeforeUnload, useLocation, useNavigate, useParams } from "react-router-dom";

import { auth, getTopic, getUserDB, updateSubtopic } from "../FirebaseClient";
import { AuthContext } from "../components/AuthContext";
import { SidebarDrawer } from "../components/SidebarDrawer";
import { CircularProgressWithLabel } from "../components/CircularProgressWithLabel";
import { IconButton } from "@mui/material";
import { State, Subtopic, Topic, Topics } from "../data/Types";
import { askQuestionPrompt, beginResponse, checkAnswerPrompt, createThread, explainTaskPrompt, getResult, getTasksPrompt, sendMessage } from "../OpenAIClient";
// import MenuIcon from '@mui/icons-material/Menu';
import ReactMarkdown from 'react-markdown';
import Ok from "../components/Ok";
import Mcq from "../components/Mcq";
import Editor from "../components/Editor";
import Loading from "../components/Loading";


export default () => {

  const [markdown, setMarkdown] = useState<string>("");

  const user = useContext(AuthContext);

  const [subtopicTree, setSubtopicTree] = useState<Subtopic>();

  const topicName = useParams().topicName?.replaceAll('-', ' ');
  const subtopicName = useParams().subtopicName?.replaceAll('-', ' ');

  const navigate = useNavigate();

  const [threadID, setThreadID] = useState(null);

  const [controlWidget, setControlWidget] = useState(<></>);
  const [currentTaskID, setCurrentTaskID] = useState<number>(-1);
  const [fsmState, setFsmState] = useState(State.DECIDING_TASKS);
  const [mcqAnswers, setMcqAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const location = useLocation();

  useEffect(() => {

    createThread().then(thread => {
      setThreadID(thread);

      if (user) {

        if (topicName === undefined || subtopicName === undefined) {
          alert("There was an issue with topic identification.")
          return;
        }


        const dProm = getTopic(user.uid, topicName);

        dProm.then((topic) => {
          if (topic === undefined) {
            alert("Topic not found!");
            return;
          }

          // setMarkdown("### " + topic.subtopics[subtopicName].name);
          beginLoading();

          if (topic.subtopics[subtopicName].locked) {
            navigate('/');
          }

          setCurrentTaskID(topic.subtopics[subtopicName].taskid ?? -1);

          if (topic.subtopics[subtopicName].tasks.length <= 0) {

            sendMessage(thread, getTasksPrompt(topic.subtopics[subtopicName].name)).then(() => {
              beginResponse(thread).then(run => {
                getResult(run, thread).then(r => {
                  const j = JSON.parse(r);
                  let i = 0;
                  for (const tkey in j) {
                    topic.subtopics[subtopicName].tasks.push({
                      name: tkey,
                      type: j[tkey],
                      id: i,
                      mastered: false,
                    });
                    i++;
                  }

                  let newMarkdown = "\n\n" + "The topics you will learn in this section are: \n\n";
                  for (const tkey in topic.subtopics[subtopicName].tasks) {
                    newMarkdown += `* ${topic.subtopics[subtopicName].tasks[tkey].name}\n`;
                  }
                  setMarkdown(newMarkdown);
                  setSubtopicTree(topic.subtopics[subtopicName]);

                  stopLoading();
                  setFsmState(State.EXPLAINING_TASKS);
                });
              });
            });
          }
          else {

            let newMarkdown = "\n\n" + "The topics you will learn in this section are: \n\n";
            for (const tkey in topic.subtopics[subtopicName].tasks) {
              newMarkdown += `* ${topic.subtopics[subtopicName].tasks[tkey].name}\n`;
            }
            setMarkdown(newMarkdown);
            setSubtopicTree(topic.subtopics[subtopicName]);

            stopLoading();
            setFsmState(State.EXPLAINING_TASKS);
          }
        });

      }
    });

  }, [user, setSubtopicTree, setThreadID, setMarkdown, setControlWidget, setFsmState, location]);

  useBeforeUnload(useCallback(async () => {
    if (user !== undefined && topicName !== undefined && subtopicName !== undefined) {
      await updateSubtopic(user?.uid || "", topicName || "", subtopicName || "", subtopicTree);
       // bruh too much safety for something that really cant happen
    }
  }, [subtopicTree, user]));

  const beginLoading = () => {
    console.log("Begin loading");
    setIsLoading(true);
    setControlWidget(<></>);
    // setControlWidget(<Loading/>);
  };

  const stopLoading = () => {
    setIsLoading(false);
    console.log("Stop loading");
  }

  useEffect(() => {

    if (fsmState === State.EXPLAINING_TASKS) {
      setControlWidget(<Ok onClick={() => {
        beginLoading();
        explainTask();
      }} />);
    }
    if (fsmState === State.ASKING_QUESTION) {
      setControlWidget(<Ok onClick={() => {
        beginLoading();
        askQuestion();
      }} />);
    }
    if (fsmState === State.CHECKING_RESPONSE_MCQ) {
      setControlWidget(<Mcq onClick={(answer: string) => {
        beginLoading();
        checkAnswer(answer);
      }} options={mcqAnswers} />);
    }
    if (fsmState === State.CHECKING_RESPONSE_CODE) {
      setControlWidget(<Editor onClick={(answer: string) => {
        beginLoading();
        checkAnswer(answer);
      }}/>);
    }
    if (fsmState === State.GIVING_FEEDBACK_POS) {
      setControlWidget(<Ok onClick={() => {
        beginLoading();
        explainTask();
      }} />);
    }
    if (fsmState === State.GIVING_FEEDBACK_NEG) {
      setControlWidget(<Ok onClick={() => {
        beginLoading();
        askQuestion();
      }} />);
    }
    if (fsmState === State.MODULE_COMPLETE) {
      setControlWidget(<Ok onClick={() => {
        beginLoading();
        navigate('/dashboard');
      }} />);
    }
    
  }, [fsmState, mcqAnswers]);


  const explainTask = async () => {
    beginLoading();
    if (!subtopicTree) { return; }
    if (currentTaskID >= (subtopicTree.tasks.length - 1)) {
      const sttlocal = subtopicTree;
      sttlocal.completed = true;
      sttlocal.taskid = -1;
      if (user) {
        await updateSubtopic(user.uid, topicName || "", subtopicName || "", sttlocal);

        // Unlock the next one
        let unlocked = false;
        getUserDB(user.uid).then(d => {
          Object.keys(d).map(k => {
            Object.keys(d[k].subtopics).map(sk => {
              if (!unlocked && d[k].subtopics[sk].locked) { /// sinful
                d[k].subtopics[sk].locked = false;
                unlocked = true;
              }
            });
          });
        });
      }
      setMarkdown("### Congratulations! \n\n You completed the module.")
      setFsmState(State.MODULE_COMPLETE);
      return;
    }
    const taskID = currentTaskID + 1;
    console.log(taskID);
    sendMessage(threadID, explainTaskPrompt(subtopicTree.tasks[taskID].name)).then(() => {
      beginResponse(threadID).then(run => {
        getResult(run, threadID).then(r => {
          const exp = JSON.parse(r)["explanation"];
          let newMarkdown = "\n\n" + exp;
          setMarkdown(newMarkdown);
          stopLoading();
          setCurrentTaskID(taskID);
          setFsmState(State.ASKING_QUESTION);
        });
      });
     
    });
  }

  const askQuestion = () => {
    if (!subtopicTree) { return; }
    sendMessage(threadID, askQuestionPrompt(subtopicTree.tasks[currentTaskID].name, subtopicTree.tasks[currentTaskID].type)).then(() => {
      beginResponse(threadID).then(run => {
        getResult(run, threadID).then(r => {
          stopLoading();
          if (subtopicTree.tasks[currentTaskID].type === "multiple-choice") {
            const j = JSON.parse(r);
            setMcqAnswers(j["responses"]);
            setMarkdown("\n\n### Multiple choice question\n\n" + j["question"]);
            setFsmState(State.CHECKING_RESPONSE_MCQ);
          } else {
            const prompt = JSON.parse(r)["prompt"];
            setMarkdown("\n\n" + prompt);
            setFsmState(State.CHECKING_RESPONSE_CODE);
          }
        });
      });
    });
  }

  const checkAnswer = (response: string) => {
    if (!subtopicTree) { return; }
    sendMessage(threadID, checkAnswerPrompt(response)).then(() => {
      beginResponse(threadID).then(run => {
        getResult(run, threadID).then(r => {
          stopLoading();
          const j = JSON.parse(r);
          const correct = j["correct"];
          const feedback = j["feedback"];
          setMarkdown("\n\n" + feedback);
          if (correct) {
            setFsmState(State.GIVING_FEEDBACK_POS); 
          } else {
            setFsmState(State.GIVING_FEEDBACK_NEG); 
          }
        });
      });
    });
  }



  return (
    <>

      <SidebarDrawer />

      {/* <h2 className="lernhead">Module {subtopicName?.split(' ')[0] || "0.0"} - {topicName?.split(' ').slice(1).join(" ") || "..."} - {subtopicName?.split(' ').slice(1).join(" ") || "..."}</h2> */}

      {/* <Header fluid/> */}

      <p style={{ marginBottom: "4.6rem" }}></p>

      <Container fluid>
        <Row>

          <Col xs={6}>
            <Card className="ml-2">
              <Card.Header>Module {subtopicName?.split(' ')[0] || "0.0"} - {topicName?.split(' ').slice(1).join(" ") || "..."} - {subtopicName?.split(' ').slice(1).join(" ") || "..."}</Card.Header>

              <Card.Body style={{ height: '25.5rem', overflowY: 'auto' }}>
              {/* <Card.Body style={{ height: '28rem', overflowY: 'auto' }}> */}
                {
                  isLoading 
                  ? (<Loading/>)
                  : (<ReactMarkdown className="rmd">{markdown}</ReactMarkdown>)
                }

              </Card.Body>
            </Card>
          </Col>

          <Col xs={6}>
            <Card className="mr-2">
              <Card.Body style={{ height: '28rem', overflowY: 'auto' }}>
                {/* {JSON.stringify(subtopicTree ?? "")} */}
                {controlWidget}
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>





    </>
  );
};

