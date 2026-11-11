// ─────────────────────────────────────────────────────────────
//  파이어베이스 설정 파일
//  1) Firebase 콘솔 → 프로젝트 설정 → 내 앱(웹 </>) 에서 복사한 값을 아래에 붙여 넣으세요.
//  2) 값을 넣기 전에는 '체험 모드'로 동작합니다(기록이 이 브라우저에만 저장됨).
// ─────────────────────────────────────────────────────────────
export const firebaseConfig = {
  apiKey: "AIzaSyAaHhfUOPkXLoql3UE3SNp0oRKb97MEL3w",
  authDomain: "emotion-routine.firebaseapp.com",
  projectId: "emotion-routine",
  storageBucket: "emotion-routine.firebasestorage.app",
  messagingSenderId: "313034958680",
  appId: "1:313034958680:web:bf6eb7e8c3cbf1bbcaa72d",
  measurementId: "G-2J4VFSJQJN",
};

// 선생님 화면 비밀번호(학생이 친구 기록을 보지 않도록 하는 간단한 잠금). 꼭 바꿔 주세요.
export const TEACHER_PIN = "2026";
