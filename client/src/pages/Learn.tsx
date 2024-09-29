// import Header from "../components/Header";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, OverlayTrigger, Popover, Row, Table } from "react-bootstrap";
import { Navigate, useBeforeUnload, useNavigate, useParams } from "react-router-dom";

import { auth, getTopic, getUserDB, updateSubtopic } from "../FirebaseClient";
import { AuthContext } from "../components/AuthContext";
import { AnchorTemporaryDrawer } from "../components/AnchorTemporaryDrawer";
import { CircularProgressWithLabel } from "../components/CircularProgressWithLabel";
import { IconButton } from "@mui/material";
import { State, Subtopic, Topic, Topics } from "../data/Types";
import { askQuestionPrompt, beginResponse, checkAnswerPrompt, createThread, explainTaskPrompt, getResult, getTasksPrompt, sendMessage } from "../OpenAIClient";
// import MenuIcon from '@mui/icons-material/Menu';
import ReactMarkdown from 'react-markdown';
import Ok from "../components/Ok";
import Mcq from "../components/Mcq";
import Editor from "../components/Editor";


export default () => {

  const [markdown, setMarkdown] = useState<string>("");

  const user = useContext(AuthContext);

  const [subtopicTree, setSubtopicTree] = useState<Subtopic>();

  const topicName = useParams().topicName?.replaceAll('-', ' ');
  const subtopicName = useParams().subtopicName?.replaceAll('-', ' ');

  const navigate = useNavigate();

  const [threadID, setThreadID] = useState(null);

  const [controlWidget, setControlWidget] = useState(<></>);
  const [currentTaskID, setCurrentTaskID] = useState(-1);
  const [fsmState, setFsmState] = useState(State.DECIDING_TASKS);
  const [mcqAnswers, setMcqAnswers] = useState<string[]>([]);


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

          setMarkdown("# Learn " + topic.subtopics[subtopicName].name);

          if (topic.subtopics[subtopicName].locked) {
            navigate('/');
          }

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
                  console.log(topic.subtopics[subtopicName].tasks);

                  updateSubtopic(user.uid, topicName, subtopicName, topic.subtopics[subtopicName]);

                  let newMarkdown = "\n\n" + "The topics you will learn in this section are: \n\n";
                  for (const tkey in topic.subtopics[subtopicName].tasks) {
                    newMarkdown += `* ${topic.subtopics[subtopicName].tasks[tkey].name}\n`;
                  }
                  setMarkdown(newMarkdown);
                  setSubtopicTree(topic.subtopics[subtopicName]);
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

            setFsmState(State.EXPLAINING_TASKS);
          }
        });

      }
    });

  }, [user, setSubtopicTree, setThreadID, setMarkdown, setControlWidget, setFsmState]);

  useEffect(() => {
    if (fsmState === State.EXPLAINING_TASKS) {
      setControlWidget(<Ok onClick={() => {
        explainTask();
        setControlWidget(<></>)
      }} />);
    }
    if (fsmState === State.ASKING_QUESTION) {
      setControlWidget(<Ok onClick={() => {
        askQuestion();
        setControlWidget(<></>)
      }} />);
    }
    if (fsmState === State.CHECKING_RESPONSE_MCQ) {
      setControlWidget(<Mcq onClick={(answer: string) => {
        checkAnswer(answer);
        setControlWidget(<></>)
      }} options={mcqAnswers} />);
    }
    if (fsmState === State.CHECKING_RESPONSE_CODE) {
      setControlWidget(<Editor onClick={(answer: string) => {
        checkAnswer(answer);
        setControlWidget(<></>)
      }}/>);
    }
    if (fsmState === State.GIVING_FEEDBACK_POS) {
      setControlWidget(<Ok onClick={() => {
        explainTask();
        setControlWidget(<></>)
      }} />);
    }
    if (fsmState === State.GIVING_FEEDBACK_NEG) {
      setControlWidget(<Ok onClick={() => {
        askQuestion();
        setControlWidget(<></>)
      }} />);
    }
    if (fsmState === State.MODULE_COMPLETE) {
      setControlWidget(<Ok onClick={() => {
        navigate('/dashboard');
        setControlWidget(<></>)
      }} />);
    }
    
  }, [fsmState, mcqAnswers]);


  const explainTask = () => {
    if (!subtopicTree) { return; }
    if (currentTaskID >= (subtopicTree.tasks.length - 1)) {
      setFsmState(State.MODULE_COMPLETE);
      return;
    }
    const taskID = currentTaskID + 1;
    sendMessage(threadID, explainTaskPrompt(subtopicTree.tasks[taskID].name)).then(() => {
      beginResponse(threadID).then(run => {
        getResult(run, threadID).then(r => {
          const exp = JSON.parse(r)["explanation"];
          let newMarkdown = "\n\n" + exp;
          setMarkdown(newMarkdown);
        });
      });
      setCurrentTaskID(taskID);
      setFsmState(State.ASKING_QUESTION);
    });
  }

  const askQuestion = () => {
    if (!subtopicTree) { return; }
    sendMessage(threadID, askQuestionPrompt(subtopicTree.tasks[currentTaskID].name, subtopicTree.tasks[currentTaskID].type)).then(() => {
      beginResponse(threadID).then(run => {
        getResult(run, threadID).then(r => {
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

      {/* {user && topicName && subtopicName && !subtopicTree[topicName].subtopics[subtopicName].locked && <Navigate></Navigate>} */}

      {/* <IconButton onClick={() => {}} sx={{ position: "fixed", top: 0, left: 0, zIndex: 2000 }}><MenuIcon/></IconButton> */}
      <AnchorTemporaryDrawer />

      {/* <Header fluid/> */}

      <p style={{ marginBottom: "5rem" }}></p>

      <Container fluid>
        <Row>

          <Col xs={6}>
            <Card>
              <Card.Header>Module {subtopicName?.split(' ')[0] || "0.0"} - {topicName?.split(' ').slice(1).join(" ") || "..."} - {subtopicName?.split(' ').slice(1).join(" ") || "..."}</Card.Header>

              <Card.Body style={{ height: '25.5rem', overflowY: 'auto' }}>
                <ReactMarkdown className="rmd">{markdown}</ReactMarkdown>

              </Card.Body>
            </Card>
          </Col>

          <Col xs={6}>
            <Card>
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

