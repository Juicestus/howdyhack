const OpenAI = require("openai");

// require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // its a hackathon so wtv but obv wouldnt do this in prod
});

const asstID = "asst_hHF31RYZMZsc5q5QF7PuXj9s";

export const createThread = async () => {
  const t = await openai.beta.threads.create();
  console.log(t);
  return t;
}

export const sendMessage = async (thread: any, prompt: string) => {
  const myThreadMessage = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: prompt,
    }
  );
}

export const beginResponse = async (thread: any) => {
  const run = await openai.beta.threads.runs.create(
    thread.id,
    {
      assistant_id: asstID,
      instructions: ""
    }
  );
  return run;
}

export const getResult = async (run: any, thread: any) => {
  let keepRetrievingRun;

  while (run.status === "queued" || run.status === "in_progress") {
    keepRetrievingRun = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    console.log(`Run status: ${keepRetrievingRun.status}`);

    if (keepRetrievingRun.status === "completed") {
      console.log("\n");

      // Step 6: Retrieve the Messages added by the Assistant to the Thread
      const allMessages = await openai.beta.threads.messages.list(thread.id);

      return Promise.resolve(allMessages.data[0].content[0].text.value);

      break;
    } else if (
      keepRetrievingRun.status === "queued" ||
      keepRetrievingRun.status === "in_progress"
    ) {
      // pass
    } else {
      console.log(`Run status: ${keepRetrievingRun.status}`);
      break;
    }
  }
};

export const getTasksPrompt = (subtopicName: string) => `Consider a student following your curriculum to learn Python. Please make a list of subtopics you would teach for "${subtopicName}". You can list as many or as few items as required for the topic as required. For each of these topics, consider if it would be better suited for either a multiple choice question or a coding challenge. Remember that introductory syntax topics are usually more suited for multiple choice questions. Return your list as a json object where the keys are these topics, and the values are either "multiple-choice" or "coding-challenge" representing what type of question best suits the topic.`;

export const explainTaskPrompt = (taskName: string) => `For the topic "${taskName}" give an explanation of the topic for Python. Encode in a json object with a single entry called "explanation" where the value is your explanation in a string. Your explaination will be treated as markdown, so feel free to use markdown syntax.`;

export const askQuestionPrompt = (taskName: string, qType: string) => {
  if (qType === "multiple-choice") {
    return `In Python, for the topic "${taskName}" create a multiple choice question with 4 possible responses. Format this question in json structure, where key "question" is the question as a string, and key "responses" holds an array of strings, representing the possible responses. Please do not include labels like A, B, C, D, etc. in the responses.`;
  } else {
    return `In Python, please write a coding challenge for the topic "${taskName}" for the student to answer. Format your response as a json object with a single entry "prompt" where the value is your challenge as a string. Make sure to give your question a markdown title.`; 
  }
}

export const checkAnswerPrompt = (userAnswer: string) => `Recall your previous question. The student answered "${userAnswer}". Please respond with a json object with field "correct" being a boolean to weather or not the question was correctly, and field "feedback" being a string of feedback on the answer. Your feedback will be treated as markdown. Make sure to include either "correct" or "incorrect" in some bold form.`;