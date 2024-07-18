import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  setDoc,
  deleteDoc,
  doc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAw__WgogTOICCBgOS7uSnX5UEEw5nfLgM",
  authDomain: "miniproject4-5e73a.firebaseapp.com",
  projectId: "miniproject4-5e73a",
  storageBucket: "miniproject4-5e73a.appspot.com",
  messagingSenderId: "281998620106",
  appId: "1:281998620106:web:373fb73ebacf4b9f9d8b33",
  measurementId: "G-GYZQBR589N",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function postComment() {
  const addContent = $("#inputBox").val().trim();
  if (addContent !== "") {
    const date = new Date();
    const id = crypto.randomUUID();
    const dateTimeString = date.toLocaleString(); // Example: 2024. 7. 17. 오후 11:12:12
    const timeString = date.toLocaleTimeString(); // Example: 오후 10:10:03
    const commentData = {
      id: id,
      content: addContent,
      dateTimeStamp: dateTimeString,
      timeStamp: timeString,
    };
    try {
      await setDoc(doc(db, "chattings", id), commentData);
      alert("게시 완료!!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("게시 중 오류가 발생했습니다.");
    }
  } else {
    alert("내용을 입력해 주세요");
  }
}
$("#postingBtn").click(postComment);
$("#inputBox").keyup((e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    postComment();
  }
});
async function loadComments() {
  const dateContentTime = [];
  const dateTimeStamptArr = [];
  const querySnapshot = await getDocs(collection(db, "chattings"));
  querySnapshot.forEach((doc) => {
    const row = doc.data();
    const content = row.content;
    const dateTimeStamp = row.dateTimeStamp;
    const timeStamp = row.timeStamp;
    const id = row.id;
    dateContentTime.push([dateTimeStamp, content, timeStamp, id]);
    dateTimeStamptArr.push(dateTimeStamp);
  });
  dateTimeStamptArr.sort().reverse();
  const result = [];
  for (let i = 0; i < dateTimeStamptArr.length; i++) {
    for (let j = 0; j < dateContentTime.length; j++) {
      if (dateContentTime[j][0] === dateTimeStamptArr[i]) {
        result.push([
          dateContentTime[j][1],
          dateContentTime[j][2],
          dateContentTime[j][3],
        ]);
      }
    }
  }
  return result;
}
async function deleteComment(docId) {
  const confirm = window.confirm("삭제하시겠습니까?");
  if (confirm) {
    try {
      await deleteDoc(doc(db, "chattings", docId));
      alert("댓글이 삭제되었습니다.");
      window.location.reload(); // 삭제 후 페이지 새로고침
    } catch (error) {
      console.error("Error removing document: ", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  }
}
(async () => {
  const comments = await loadComments();
  comments.forEach((comment, index) => {
    const commentIdx = comment[2];
    const isEvenIndex = index % 2 === 0;
    const div = $("<div>")
      .attr("commentIdx", commentIdx)
      .text(comment[0])
      .css({
        border: "3px solid white",
        "border-radius": "10px",
        margin: "20px 0",
        padding: "8px 14px",
        "max-width": "60%",
        "font-size": "16px",
        background: "rgba(233, 233, 233, 0.5)",
        "text-align": isEvenIndex ? "left" : "right",
        "margin-left": isEvenIndex ? "0" : "auto",
        "word-break": "break-all",
      });

    const deleteBtnDiv = $("<div>").css({
      display: "flex",
      "justify-content": isEvenIndex ? "start" : "end",
      gap: "10px",
      "align-items": "center",
    });

    const timeDiv = $("<div>")
      .text(comment[1])
      .css({
        "font-size": "16px",
        "text-align": isEvenIndex ? "left" : "right",
      });

    const deleteBtn = $("<button>")
      .text("삭제")
      .attr("commentIdx", commentIdx)
      .click((e) => {
        const docId = $(e.target).attr("commentIdx");
        deleteComment(docId);
      })
      .css({
        outline: "none",
        border: "none",
        width: "40px",
        height: "25px",
        "border-radius": "5px",
        cursor: "pointer",
      });

    deleteBtnDiv.append(timeDiv);
    deleteBtnDiv.append(deleteBtn);

    $("#chatting").append(div);
    $("#chatting").append(deleteBtnDiv);
  });
})();
