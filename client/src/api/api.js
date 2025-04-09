import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAgentResponse =async (userQuery, chatHistory) => {
  try {
    console.log("Sending request to /chat with payload:", {
      query: userQuery,
      history: chatHistory,
    });

    const response = await api.post("/chat", {
      query: userQuery,
      history: chatHistory,
    } );
    console.log("Received response from /chat:", response.data);

    const message = 
      {
        role: "assistant",
        content: response.data.response
      }
      console.log("Formatted message:", message);

    return message;

  } catch (error) {
    console.error("Error fetching hello:", error);
    return { role: "assistant", content: "Error fetching data" };
  }
}





// export const getAIMessage = async (userQuery) => {

//   const message = 
//     {
//       role: "assistant",
//       content: "Connect your backend here...."
//     }

//   return message;
// };

