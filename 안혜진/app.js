import { firebaseConfig, TEACHER_PIN } from "./firebase-config.js";

/* ════════════════════════════════════════════
   1. 데이터 (감정 · 몸 신호 · 이유 · 돌보기 방법 · 연습 장면)
   ════════════════════════════════════════════ */
const EMOTIONS = {
  joy:   { name: "기쁨",     wx: "☀️", face: "😊", weather: "맑음",     color: "var(--joy)",   neg: false,
           words: ["신나는", "뿌듯한", "설레는", "고마운", "자랑스러운", "즐거운"] },
  sad:   { name: "슬픔",     wx: "🌧️", face: "😢", weather: "비",       color: "var(--sad)",   neg: true,
           words: ["서운한", "외로운", "실망한", "속상한", "그리운", "아쉬운"] },
  angry: { name: "화남",     wx: "⛈️", face: "😠", weather: "천둥번개", color: "var(--angry)", neg: true,
           words: ["억울한", "짜증나는", "답답한", "분한", "질투나는", "약오르는"] },
  worry: { name: "걱정",     wx: "🌫️", face: "😟", weather: "안개",     color: "var(--worry)", neg: true,
           words: ["불안한", "긴장되는", "초조한", "두려운", "막막한", "조마조마한"] },
  shy:   { name: "부끄러움", wx: "🌸", face: "😳", weather: "꽃샘바람", color: "var(--shy)",   neg: true,
           words: ["창피한", "당황한", "어색한", "미안한", "쑥스러운", "민망한"] },
  calm:  { name: "평온",     wx: "🍃", face: "😌", weather: "산들바람", color: "var(--calm)",  neg: false,
           words: ["차분한", "느긋한", "안심되는", "홀가분한", "편안한", "만족스러운"] },
  tired: { name: "피곤",     wx: "☁️", face: "😪", weather: "흐림",     color: "var(--tired)", neg: true,
           words: ["지친", "나른한", "지루한", "멍한", "기운 없는", "졸린"] },
};

const BODY = [
  ["🔥", "얼굴이 뜨거워요"], ["💓", "심장이 빨리 뛰어요"], ["✊", "주먹에 힘이 들어가요"],
  ["😮‍💨", "배·가슴이 답답해요"], ["🪨", "어깨가 무거워요"], ["💧", "눈물이 날 것 같아요"],
  ["🪶", "몸이 가벼워요"], ["😄", "웃음이 나와요"], ["🥱", "하품이 나와요"],
  ["💦", "손에 땀이 나요"], ["🫨", "몸이 떨려요"], ["🤔", "잘 모르겠어요"],
];

const REASONS = [
  ["🧑‍🤝‍🧑", "친구 관계"], ["🏠", "가족"], ["📚", "공부·숙제"], ["⚽", "놀이·운동"],
  ["🍚", "잠·배고픔 같은 몸 상태"], ["🌦️", "날씨"], ["🎉", "특별한 일·행사"], ["❓", "잘 모르겠어요"],
];

/* 마음 대화에 쓰는 데이터 */
const SITUATION_CHIPS = ["아침에 집에서", "등굣길에", "수업 시간에", "쉬는 시간에", "점심시간에", "어제 저녁에", "학원에서"];
const NEEDS = [
  ["🏅", "인정"], ["🤝", "존중"], ["🧑‍🤝‍🧑", "함께함"], ["⚖️", "공정함"], ["🛡️", "안전"],
  ["🌱", "잘하고 싶은 마음"], ["🛋️", "쉼"], ["🕊️", "자유"], ["💛", "사랑받는 느낌"],
];
const LEVELS = [
  null,
  { name: "감정 낱말",            ico: "🌱", tip: "다음에는 '언제, 어디서'를 함께 말해 볼까요?" },
  { name: "상황 + 감정",          ico: "🌿", tip: "다음에는 '왜' 그 마음이 들었는지도 말해 봐요." },
  { name: "상황 + 원인 + 감정",    ico: "🌳", tip: "다음에는 '내가 정말 바랐던 것'까지 찾아봐요." },
  { name: "상황 + 원인 + 감정 + 바람", ico: "🌈", tip: "내 마음을 깊이 들여다보는 멋진 문장이에요!" },
];

const STRATEGIES = {
  breath: { ico: "🎈", name: "풍선 호흡",        desc: "풍선처럼 숨을 4초 들이마시고, 4초 멈추고, 4초 내쉬어요." },
  senses: { ico: "🖐️", name: "5-4-3-2-1 감각 찾기", desc: "지금 여기에서 보이고 들리는 것을 찾으며 마음을 붙잡아요." },
  imsg:   { ico: "🗣️", name: "나-전달법으로 말하기", desc: "탓하지 않고 내 마음과 바람을 말로 표현해요." },
  helper: { ico: "🤝", name: "도움 요청하기",      desc: "혼자 감당하기 힘들 때 믿을 수 있는 사람을 떠올려요." },
  share:  { ico: "🎁", name: "기쁨 나누기",        desc: "좋은 마음을 누구와, 어떻게 나눌지 정해요." },
  thanks: { ico: "✍️", name: "고마움 한 줄",       desc: "오늘 고마운 사람이나 일을 한 줄로 적어요." },
  stretch:{ ico: "🙆", name: "기지개 스트레칭",    desc: "몸을 쭉 펴서 졸린 몸에 신호를 보내요." },
};
const RECOMMEND = {
  joy: ["share", "thanks", "breath"], calm: ["thanks", "share", "senses"],
  sad: ["helper", "breath", "imsg"],  angry: ["breath", "imsg", "senses"],
  worry: ["breath", "senses", "helper"], shy: ["breath", "imsg", "helper"],
  tired: ["stretch", "breath", "senses"],
};

/* 친구 마음 읽기 장면 모음 — 접속할 때마다 이 중 SCENES_PER_ROUND개를 무작위로 뽑아요.
   장면을 더 넣고 싶으면 같은 모양으로 아래에 추가하면 돼요. (answers에는 good 1개, meh 1개, bad 1개) */
const SCENE_POOL = [
  { face: "😣", who: "민준", place: "쉬는 시간 · 교실",
    text: "민준이가 20분 동안 쌓은 블록 탑을 지나가던 친구가 실수로 무너뜨렸어요. 민준이는 주먹을 꽉 쥐고 얼굴이 빨개졌어요.",
    clue: "꽉 쥔 주먹, 빨개진 얼굴, 오래 공들인 탑",
    feel: ["angry", "sad"],
    answers: [
      { t: "괜찮아, 다시 만들면 되지! 별거 아니야.", k: "meh", f: "도와주려는 마음은 좋아요. 하지만 '별거 아니야'라는 말은 민준이의 마음을 작게 만들 수 있어요. 마음을 먼저 알아주면 더 좋아요." },
      { t: "20분이나 열심히 만들었는데 무너져서 정말 속상하고 화나겠다.", k: "good", f: "민준이가 한 노력과 감정을 그대로 말해 주었어요. 마음을 알아주는 말을 들으면 화가 조금씩 가라앉아요." },
      { t: "실수로 그런 건데 왜 화를 내?", k: "bad", f: "상대 입장만 말하면 민준이는 혼나는 느낌을 받을 수 있어요. 감정은 먼저 인정하고, 그다음에 상황을 이야기해요." },
    ] },
  { face: "😬", who: "서연", place: "국어 시간 · 발표 전",
    text: "다음 발표 차례인 서연이가 종이를 접었다 폈다 하며 손을 만지작거리고 있어요. 입술을 꼭 깨물고 있어요.",
    clue: "손 만지작거리기, 입술 깨물기, 곧 다가올 발표",
    feel: ["worry", "shy"],
    answers: [
      { t: "많이 떨리지? 나도 발표 전엔 심장이 쿵쾅거려. 너 연습 많이 했잖아.", k: "good", f: "서연이의 긴장을 알아주고, 나도 그렇다고 말해 주었어요. '나만 그런 게 아니구나' 하는 마음이 큰 힘이 돼요." },
      { t: "발표가 뭐가 무서워? 그냥 읽으면 되잖아.", k: "bad", f: "다른 사람에게는 쉬운 일이 누군가에게는 어려울 수 있어요. 감정을 가볍게 여기면 더 긴장될 수 있어요." },
      { t: "틀리면 친구들이 웃을 수도 있으니까 조심해.", k: "meh", f: "걱정해 주는 말이지만, 걱정을 더 키울 수 있어요. 할 수 있다는 믿음을 함께 전해 주세요." },
    ] },
  { face: "😶", who: "하준", place: "점심시간 · 운동장 가",
    text: "지난주에 전학 온 하준이가 친구들이 공놀이하는 모습을 벤치에 앉아 혼자 바라보고 있어요.",
    clue: "혼자 앉아 있음, 놀이를 바라봄, 전학 온 지 얼마 안 됨",
    feel: ["sad", "shy", "worry"],
    answers: [
      { t: "(그냥 지나간다)", k: "meh", f: "모른 척하는 것도 나쁜 일은 아니지만, 작은 한마디가 하준이에게 큰 용기가 될 수 있어요." },
      { t: "하준아, 우리 공놀이 하는데 같이 할래? 규칙은 내가 알려 줄게.", k: "good", f: "새로운 곳에서 어색하고 외로운 마음을 먼저 알아채고 다가갔어요. 함께하자는 말은 최고의 공감이에요." },
      { t: "너는 왜 맨날 혼자 있어?", k: "bad", f: "궁금한 마음이라도 '왜 맨날'이라는 말은 탓하는 것처럼 들려 더 움츠러들게 할 수 있어요." },
    ] },
  { face: "🥹", who: "지우", place: "아침 시간 · 교실",
    text: "받아쓰기를 매일 연습하던 지우가 처음으로 100점을 받았어요. 시험지를 꼭 쥐고 자꾸 웃음이 새어 나와요.",
    clue: "꼭 쥔 시험지, 새어 나오는 웃음, 매일 한 연습",
    feel: ["joy", "calm"],
    answers: [
      { t: "와, 매일 연습하더니 드디어 100점이네! 정말 뿌듯하겠다!", k: "good", f: "기쁜 마음도 함께 알아주면 두 배가 돼요. 지우의 노력까지 알아준 멋진 말이에요." },
      { t: "100점? 나도 지난번에 100점 받았는데.", k: "bad", f: "친구의 기쁜 순간에 내 이야기로 바꾸면 친구는 서운할 수 있어요. 오늘의 주인공은 지우예요." },
      { t: "운이 좋았나 보다.", k: "meh", f: "가벼운 말이지만 지우가 들인 노력을 놓칠 수 있어요. 결과보다 과정을 알아주면 더 좋아요." },
    ] },
  { face: "😖", who: "도윤", place: "체육 시간 · 강당",
    text: "달리기를 하던 도윤이가 미끄러져 넘어졌어요. 몇몇 친구가 웃자 도윤이는 고개를 숙이고 무릎만 바라봐요.",
    clue: "고개 숙임, 친구들의 웃음, 넘어진 상황",
    feel: ["shy", "sad", "angry"],
    answers: [
      { t: "푸하하, 방금 완전 웃겼어!", k: "bad", f: "도윤이는 이미 창피하고 아픈 상태예요. 웃음은 마음의 상처를 더 크게 만들 수 있어요." },
      { t: "괜찮아? 다친 데는 없어? 넘어지면 누구나 당황스러워.", k: "good", f: "몸과 마음을 함께 살펴 주었어요. '누구나 그럴 수 있다'는 말은 부끄러운 마음을 덜어 줘요." },
      { t: "다음엔 조심해서 뛰어.", k: "meh", f: "틀린 말은 아니지만, 지금 도윤이에게 필요한 건 충고보다 위로예요." },
    ] },
  { face: "🥱", who: "예린", place: "1교시 · 교실",
    text: "예린이가 아침부터 하품을 계속하며 책상에 엎드려 있어요. 친구가 말을 걸어도 대답이 느려요.",
    clue: "계속되는 하품, 엎드린 자세, 느린 대답",
    feel: ["tired", "sad"],
    answers: [
      { t: "많이 피곤해 보여. 어제 잠을 잘 못 잤어? 물 한 잔 같이 마시러 갈래?", k: "good", f: "예린이의 몸 상태를 알아차리고 도와줄 방법까지 제안했어요. 몸의 신호를 읽는 것도 공감이에요." },
      { t: "수업 시간에 자면 안 되잖아.", k: "meh", f: "규칙도 중요하지만, 왜 피곤한지 먼저 물어보면 예린이가 마음을 열기 쉬워요." },
      { t: "너 게으르구나.", k: "bad", f: "피곤한 이유는 여러 가지예요. 성격을 탓하는 말은 친구에게 상처가 돼요." },
    ] },
  { face: "😳", who: "수아", place: "점심시간 · 급식실",
    text: "수아가 식판을 들고 자리로 가다가 발이 걸려 음식을 바닥에 쏟았어요. 주변 친구들이 모두 쳐다보자 수아는 얼굴이 빨개져서 그 자리에 굳어 버렸어요.",
    clue: "빨개진 얼굴, 굳은 몸, 모두의 시선",
    feel: ["shy", "sad", "worry"],
    answers: [
      { t: "많이 놀랐지? 같이 치우자. 나도 저번에 쏟은 적 있어.", k: "good", f: "수아의 놀라고 창피한 마음을 알아주고, 바로 옆에서 도와주었어요. '나도 그런 적 있어'는 큰 위로가 돼요." },
      { t: "선생님! 수아가 급식 쏟았어요!", k: "bad", f: "큰 소리로 알리면 더 많은 친구가 쳐다보게 돼요. 수아의 부끄러운 마음이 훨씬 커질 수 있어요." },
      { t: "빨리 닦아. 뒤에 사람들 기다리잖아.", k: "meh", f: "치워야 하는 건 맞지만, 재촉하면 수아는 더 당황해요. 마음을 먼저 살피고 함께 도와주면 좋아요." },
    ] },
  { face: "😞", who: "현우", place: "체육 시간 · 운동장",
    text: "피구 편을 나누는데 현우의 이름이 끝까지 불리지 않았어요. 마지막에 남은 현우는 운동화 끝으로 바닥만 툭툭 차고 있어요.",
    clue: "마지막까지 남음, 바닥을 차는 발, 숙인 고개",
    feel: ["sad", "angry", "shy"],
    answers: [
      { t: "어차피 한 팀에는 들어가잖아. 신경 쓰지 마.", k: "meh", f: "달래 주려는 말이지만, '신경 쓰지 마'는 현우의 서운한 마음을 건너뛰게 돼요. 먼저 마음을 알아주세요." },
      { t: "네가 피구를 못하니까 그렇지.", k: "bad", f: "이미 속상한 친구에게 이유를 탓하는 말은 상처가 돼요. 잘하고 못하고를 떠나 누구나 함께하고 싶어 해요." },
      { t: "끝까지 기다리느라 속상했겠다. 우리 팀에 와서 나랑 같이 하자!", k: "good", f: "기다리는 동안의 서운함을 알아주고, 함께하자고 말해 주었어요. 현우가 환영받는 느낌을 받을 수 있어요." },
    ] },
  { face: "😠", who: "지호", place: "미술 시간 · 교실",
    text: "짝이 말도 없이 지호의 새 색연필을 가져가 쓰다가 심을 부러뜨렸어요. 지호는 입을 꾹 다물고 숨을 크게 몰아쉬고 있어요.",
    clue: "꾹 다문 입, 거친 숨, 허락 없이 가져간 새 물건",
    feel: ["angry", "sad"],
    answers: [
      { t: "색연필 하나 가지고 뭘 그래.", k: "bad", f: "나에게는 작은 일이어도 지호에게는 소중한 물건이에요. 감정을 작게 여기는 말은 화를 더 키워요." },
      { t: "아끼는 새 색연필인데 말도 없이 써서 부러졌으니 정말 화나겠다.", k: "good", f: "무엇 때문에 화가 났는지 정확히 알아주었어요. 내 마음을 알아주는 친구가 있으면 화가 조금 누그러져요." },
      { t: "선생님한테 말해서 새로 사 달라고 해.", k: "meh", f: "해결 방법을 알려 주는 것도 도움이 되지만, 지금은 화난 마음을 먼저 알아주는 것이 더 필요해요." },
    ] },
  { face: "😟", who: "나은", place: "아침 시간 · 교실",
    text: "나은이네 강아지가 어젯밤부터 아파서 병원에 갔어요. 나은이는 책을 펴 놓고도 창밖만 바라보며 자꾸 시계를 봐요.",
    clue: "창밖만 바라봄, 자꾸 보는 시계, 아픈 강아지",
    feel: ["worry", "sad"],
    answers: [
      { t: "강아지가 아파서 걱정이 많이 되겠다. 얼른 나았으면 좋겠어.", k: "good", f: "나은이의 걱정을 그대로 알아주고 같은 마음으로 바라 주었어요. 함께 걱정해 주는 것만으로도 힘이 돼요." },
      { t: "병원 갔으면 괜찮을 거야. 걱정하지 마.", k: "meh", f: "안심시켜 주려는 좋은 마음이에요. 다만 '걱정하지 마'보다 '걱정되겠다'가 먼저 오면 마음이 더 잘 전해져요." },
      { t: "강아지 때문에 그러는 거야? 수업 시간엔 집중해야지.", k: "bad", f: "가족 같은 강아지가 아프면 집중하기 어려운 게 당연해요. 마음을 가볍게 여기면 나은이는 더 외로워져요." },
    ] },
  { face: "🤩", who: "시우", place: "중간 놀이 시간 · 운동장",
    text: "한 달 동안 연습하던 시우가 줄넘기 2단 뛰기를 처음으로 성공했어요. 시우는 폴짝폴짝 뛰며 친구들을 두리번두리번 찾고 있어요.",
    clue: "폴짝폴짝 뛰는 몸, 친구를 찾는 눈, 한 달 동안의 연습",
    feel: ["joy"],
    answers: [
      { t: "2단 뛰기는 나도 벌써 하는데?", k: "bad", f: "친구가 기뻐하는 순간에 나와 비교하면 기쁨이 쪼그라들어요. 지금은 시우의 성공을 함께 기뻐해 줄 때예요." },
      { t: "오, 됐네.", k: "meh", f: "알아봐 주긴 했지만 조금 아쉬워요. 시우가 얼마나 기쁜지, 얼마나 노력했는지 말로 표현해 주면 더 좋아요." },
      { t: "우아, 드디어 성공했네! 한 달이나 연습했으니까 진짜 신나겠다!", k: "good", f: "시우의 기쁨과 그동안의 노력을 함께 알아주었어요. 기쁜 마음에 공감해 주는 것도 아주 중요한 공감이에요." },
    ] },
  { face: "😌", who: "채원", place: "점심시간 · 도서관",
    text: "채원이가 도서관 창가 자리에서 좋아하는 책을 읽고 있어요. 어깨에 힘이 빠져 있고 입가에 살짝 미소가 있어요.",
    clue: "힘이 빠진 어깨, 살짝 띤 미소, 조용한 창가 자리",
    feel: ["calm", "joy"],
    answers: [
      { t: "(조용히 옆에 앉아 작은 소리로) 편안해 보인다. 나도 여기서 책 읽어도 돼?", k: "good", f: "채원이의 편안한 마음을 알아차리고, 그 시간을 지켜 주면서 다가갔어요. 평온한 마음도 알아주면 좋아요." },
      { t: "책만 읽으면 심심하지 않아? 나가서 놀자!", k: "meh", f: "같이 놀고 싶은 마음은 좋아요. 하지만 채원이는 지금 이 시간이 좋을 수 있어요. 친구의 지금 마음을 먼저 물어봐요." },
      { t: "점심시간에 혼자 책 읽는 거 좀 이상해.", k: "bad", f: "쉬는 방법은 사람마다 달라요. 친구가 좋아하는 것을 이상하다고 하면 마음이 움츠러들어요." },
    ] },
  { face: "😩", who: "태민", place: "등굣길 · 교문 앞",
    text: "태민이가 가방을 축 늘어뜨리고 느릿느릿 걸어와요. 어젯밤 늦게까지 숙제를 했다며 눈을 자꾸 비벼요.",
    clue: "늘어진 가방, 느린 걸음, 비비는 눈",
    feel: ["tired", "worry"],
    answers: [
      { t: "숙제는 미리미리 했어야지.", k: "meh", f: "맞는 말일 수 있지만, 이미 지친 태민이에게는 잔소리처럼 들려요. 지금의 힘든 몸과 마음을 먼저 알아주세요." },
      { t: "늦게까지 숙제하느라 엄청 피곤하겠다. 가방 무거우면 교실까지 같이 들어 줄까?", k: "good", f: "태민이가 왜 피곤한지 알아주고, 작은 도움을 건넸어요. 몸이 힘든 친구에게는 이런 한마디가 큰 힘이 돼요." },
      { t: "야, 빨리 좀 걸어. 너 때문에 지각하겠다.", k: "bad", f: "지친 친구를 재촉하고 탓하면 몸도 마음도 더 무거워져요. 왜 느린지 먼저 살펴봐요." },
    ] },
  { face: "🥺", who: "유나", place: "쉬는 시간 · 복도",
    text: "유나의 단짝이 오늘은 다른 친구와만 귓속말을 하며 놀아요. 유나는 멀찍이 서서 두 친구를 바라보다가 고개를 돌렸어요.",
    clue: "멀리서 바라봄, 돌린 고개, 귓속말하는 단짝",
    feel: ["sad", "angry", "worry"],
    answers: [
      { t: "쟤네 나쁘다. 우리도 쟤네랑 놀지 말자.", k: "bad", f: "유나 편을 들어 주려는 마음이지만, 다른 친구를 따돌리면 속상한 사람이 더 늘어나요." },
      { t: "단짝이 다른 친구랑만 놀아서 서운했겠다. 나랑 같이 있을래?", k: "good", f: "유나의 서운함을 알아주고 곁에 있어 주었어요. 혼자가 아니라는 느낌이 마음을 든든하게 해 줘요." },
      { t: "친구가 다른 애랑 놀 수도 있지, 뭐.", k: "meh", f: "틀린 말은 아니에요. 하지만 지금 유나에게는 '그럴 수도 있지'보다 '서운했겠다'가 더 필요해요." },
    ] },
  { face: "😰", who: "건우", place: "음악 시간 직전 · 교실",
    text: "건우가 가방 속을 몇 번이나 뒤지고 있어요. 오늘 리코더 시험이 있는데 리코더가 보이지 않아요. 건우의 손이 점점 빨라져요.",
    clue: "가방을 계속 뒤짐, 빨라지는 손, 곧 시작될 시험",
    feel: ["worry", "shy"],
    answers: [
      { t: "리코더가 없어서 엄청 걱정되겠다. 선생님께 같이 가서 말씀드려 볼까?", k: "good", f: "건우의 걱정을 알아주고, 혼자 해결하지 않아도 되게 함께해 주었어요. 걱정은 나누면 작아져요." },
      { t: "넌 맨날 뭘 잊어버리더라.", k: "bad", f: "'맨날'이라는 말은 건우를 탓하는 말이에요. 이미 불안한 마음에 창피함까지 더해질 수 있어요." },
      { t: "혼나도 어쩔 수 없지. 다음엔 잘 챙겨.", k: "meh", f: "다음을 위한 말이지만 지금의 걱정을 덜어 주지는 못해요. 걱정되는 마음을 먼저 알아주면 좋아요." },
    ] },
  { face: "☺️", who: "소율", place: "아침 시간 · 복도 게시판 앞",
    text: "소율이의 그림이 우수 작품으로 뽑혀 복도 게시판에 걸렸어요. 친구들이 모여들자 소율이는 볼이 빨개져서 손으로 얼굴을 가리며 웃어요.",
    clue: "빨개진 볼, 얼굴을 가린 손, 새어 나오는 웃음",
    feel: ["shy", "joy"],
    answers: [
      { t: "별로 잘 그린 것 같지도 않은데 왜 뽑혔지?", k: "bad", f: "친구의 기쁜 순간을 깎아내리는 말이에요. 부럽거나 샘이 나더라도 친구의 마음을 먼저 생각해 봐요." },
      { t: "소율아, 그림 진짜 멋지다! 다들 봐서 좀 쑥스럽지? 그래도 정말 기쁘겠다.", k: "good", f: "기쁨과 쑥스러움, 두 가지 마음을 모두 알아주었어요. 한 번에 여러 감정이 들 수 있다는 걸 잘 읽었어요." },
      { t: "왜 얼굴을 가려? 자랑해야지!", k: "meh", f: "응원하는 마음은 좋아요. 하지만 쑥스러운 마음도 자연스러운 감정이에요. 그 마음도 그대로 알아주세요." },
    ] },
  { face: "😡", who: "은호", place: "점심시간 · 급식 줄",
    text: "은호가 한참 줄을 서 있는데 다른 반 친구가 은호 앞으로 슬쩍 끼어들었어요. 은호는 눈썹을 찌푸리고 발을 쿵 굴렀어요.",
    clue: "찌푸린 눈썹, 쿵 구른 발, 새치기",
    feel: ["angry"],
    answers: [
      { t: "한 명 끼어든 건데 그냥 참아.", k: "meh", f: "싸움을 막으려는 마음은 좋아요. 하지만 화나는 게 당연한 상황이라는 걸 먼저 알아주면 은호가 덜 억울해요." },
      { t: "오래 기다렸는데 새치기당해서 화났겠다. 같이 가서 뒤로 가 달라고 말해 볼까?", k: "good", f: "화난 이유를 알아주고, 화를 말로 풀 수 있게 도와주었어요. 감정을 인정받으면 차분하게 말할 힘이 생겨요." },
      { t: "그걸로 발까지 굴러? 너 성격 진짜 급하다.", k: "bad", f: "공정하지 않은 일에 화가 나는 건 자연스러워요. 성격을 탓하면 은호는 더 억울해져요." },
    ] },
  { face: "😢", who: "다인", place: "종례 시간 · 교실",
    text: "선생님이 다인이의 가장 친한 친구가 다음 주에 전학을 간다고 알려 주셨어요. 다인이는 눈시울이 붉어져서 책상만 내려다보고 있어요.",
    clue: "붉어진 눈시울, 책상만 보는 눈, 친한 친구의 전학",
    feel: ["sad", "worry"],
    answers: [
      { t: "제일 친한 친구가 전학 간다니 정말 슬프겠다. 울고 싶으면 울어도 괜찮아.", k: "good", f: "다인이의 슬픔을 알아주고, 슬퍼해도 괜찮다고 말해 주었어요. 슬픔은 참는 것보다 알아줄 때 가벼워져요." },
      { t: "전화하면 되잖아. 울지 마.", k: "meh", f: "방법을 알려 주려는 마음은 고마워요. 하지만 '울지 마'보다 슬픈 마음을 먼저 알아주는 말이 필요해요." },
      { t: "친구는 또 사귀면 되지. 그게 울 일이야?", k: "bad", f: "소중한 친구는 다른 사람으로 바꿀 수 없어요. 슬픔을 별것 아닌 일로 만들면 다인이는 더 아파요." },
    ] },
  { face: "😮‍💨", who: "준서", place: "수학 시간 · 교실",
    text: "준서가 같은 문제를 세 번째 지우개로 지우고 있어요. 한숨을 푹 쉬더니 연필을 내려놓고 머리를 감싸 쥐었어요.",
    clue: "여러 번 지운 자국, 깊은 한숨, 감싸 쥔 머리",
    feel: ["worry", "angry", "sad"],
    answers: [
      { t: "이거 엄청 쉬운 문제인데? 아직도 못 풀었어?", k: "bad", f: "'쉬운 문제'라는 말은 준서를 더 작아지게 만들어요. 어려움은 사람마다 달라요." },
      { t: "답은 12야. 그냥 이거 써.", k: "meh", f: "도와주고 싶은 마음은 좋지만, 답만 알려 주면 준서의 답답한 마음은 그대로 남아요. 마음을 먼저 알아봐 주세요." },
      { t: "계속 안 풀려서 답답하겠다. 나도 이 문제 헷갈렸어. 같이 볼까?", k: "good", f: "답답한 마음을 알아주고 '나도 그랬어'라고 말해 주었어요. 혼자만 어려운 게 아니라는 걸 알면 다시 해 볼 힘이 나요." },
    ] },
  { face: "🙂", who: "하린", place: "쉬는 시간 · 교실 창가",
    text: "하린이가 자기가 맡은 화분에 물을 주고 있어요. 새로 난 잎을 가만히 들여다보며 작게 콧노래를 불러요.",
    clue: "작은 콧노래, 느긋한 손길, 새로 난 잎",
    feel: ["calm", "joy"],
    answers: [
      { t: "화분 돌보는 거 귀찮지 않아? 나라면 안 해.", k: "bad", f: "친구가 좋아서 하는 일을 낮추어 말하면 하린이의 좋은 기분이 사라질 수 있어요." },
      { t: "새 잎이 났네! 네가 잘 돌봐서 그런가 봐. 기분 좋아 보인다.", k: "good", f: "하린이의 편안하고 뿌듯한 마음을 알아주었어요. 좋은 마음을 알아주면 그 마음이 더 오래가요." },
      { t: "물 다 줬으면 빨리 와. 우리 놀 거야.", k: "meh", f: "같이 놀자는 말은 반갑지만, 하린이가 즐기고 있는 시간도 잠깐 함께 봐 주면 더 좋아요." },
    ] },
  { face: "😮‍💨", who: "민재", place: "운동회 연습 뒤 · 계단",
    text: "이어달리기 연습을 세 번이나 한 민재가 계단에 털썩 앉았어요. 땀을 닦으며 물통을 든 채 한동안 아무 말이 없어요.",
    clue: "털썩 앉은 몸, 흐르는 땀, 말이 없음",
    feel: ["tired"],
    answers: [
      { t: "세 번이나 뛰어서 진짜 힘들겠다. 여기서 좀 쉬어. 물 더 떠다 줄까?", k: "good", f: "민재의 지친 몸을 알아주고 쉴 수 있게 해 주었어요. 피곤한 친구에게는 쉬어도 된다는 말이 큰 선물이에요." },
      { t: "벌써 지쳤어? 한 번 더 뛰어야 하는데.", k: "bad", f: "이미 힘을 다 쓴 친구를 몰아붙이는 말이에요. 몸이 보내는 신호는 존중받아야 해요." },
      { t: "힘내! 파이팅!", k: "meh", f: "응원하는 마음은 좋아요. 하지만 지금 민재에게는 힘내라는 말보다 쉬어도 된다는 말이 더 필요할 수 있어요." },
    ] },
  { face: "🫣", who: "서윤", place: "아침 시간 · 교실 문 앞",
    text: "서윤이가 오늘 처음으로 안경을 쓰고 학교에 왔어요. 교실 문 앞에서 머뭇거리다가 머리카락으로 얼굴을 가리고 조용히 자리에 앉았어요.",
    clue: "문 앞에서 머뭇거림, 가린 얼굴, 처음 쓴 안경",
    feel: ["shy", "worry"],
    answers: [
      { t: "얘들아, 서윤이 안경 썼다! 다 와서 봐!", k: "bad", f: "모두의 눈길을 끌면 서윤이는 더 숨고 싶어져요. 쑥스러워하는 친구에게는 조용한 관심이 좋아요." },
      { t: "안경은 왜 썼어? 눈이 많이 나빠?", k: "meh", f: "궁금한 건 자연스러워요. 하지만 서윤이가 먼저 편안해질 수 있게 마음을 살피는 말부터 건네 봐요." },
      { t: "(작은 소리로) 안경 잘 어울린다. 처음 쓰고 와서 좀 떨렸지?", k: "good", f: "서윤이의 쑥스럽고 걱정되는 마음을 조용히 알아주었어요. 작은 목소리도 공감의 한 방법이에요." },
    ] },
  { face: "🥳", who: "지안", place: "아침 시간 · 교실",
    text: "오늘은 지안이의 생일이에요. 교실에 들어오니 칠판에 친구들이 쓴 축하 글이 가득해요. 지안이는 눈이 동그래져서 입을 다물지 못해요.",
    clue: "동그래진 눈, 벌어진 입, 칠판 가득한 축하 글",
    feel: ["joy"],
    answers: [
      { t: "깜짝 놀랐지? 생일 축하해! 네가 기뻐하니까 나도 기분이 좋아.", k: "good", f: "지안이의 놀라고 기쁜 마음을 함께 느끼고 말로 전했어요. 기쁨은 함께 나눌 때 더 커져요." },
      { t: "생일이 뭐 대단한 날이라고.", k: "bad", f: "친구에게 특별한 날을 깎아내리면 기쁜 마음에 찬물을 끼얹게 돼요." },
      { t: "생일이니까 맛있는 거 사 줘!", k: "meh", f: "장난스러운 말이지만 오늘의 주인공은 지안이예요. 축하하는 마음을 먼저 전해 주면 좋아요." },
    ] },
  { face: "😔", who: "로운", place: "모둠 활동 시간 · 교실",
    text: "모둠에서 발표 주제를 정하고 있어요. 로운이가 낸 의견은 아무도 대답하지 않고 넘어갔어요. 로운이는 연필만 굴리며 더는 말을 하지 않아요.",
    clue: "연필만 굴림, 줄어든 말, 대답 없이 넘어간 의견",
    feel: ["sad", "angry", "shy"],
    answers: [
      { t: "로운아, 뭐 해? 너도 의견 좀 내 봐.", k: "meh", f: "함께하자는 뜻이지만, 로운이는 이미 의견을 냈어요. 그 의견이 넘어가서 속상한 마음을 먼저 봐 주세요." },
      { t: "아까 로운이 의견을 그냥 넘어가서 속상했을 것 같아. 로운아, 다시 한번 말해 줄래?", k: "good", f: "로운이가 왜 말이 없어졌는지 알아차리고, 다시 말할 기회를 만들어 주었어요. 존중받는 느낌을 줄 수 있어요." },
      { t: "네 의견은 별로였으니까 그렇지.", k: "bad", f: "의견이 채택되지 않더라도 들어 주는 것은 중요해요. 이런 말은 다음에 말할 용기까지 빼앗아요." },
    ] },
];

/* 한 번에 보여 줄 장면 수 */
const SCENES_PER_ROUND = 6;
const RECENT_SCENES_KEY = "maeum_recent_scenes";
let SCENES = [];

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/* 받침이 있는 이름에는 '이'를 붙여요. (민준 → 민준이, 지우 → 지우) */
function nick(name) {
  const c = name.charCodeAt(name.length - 1);
  return name + (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0 ? "이" : "");
}
/* 장면을 새로 뽑아요: 바로 전에 본 장면은 되도록 피하고, 여러 감정이 고루 나오게 골라요. 보기 순서도 섞어요. */
function drawScenes() {
  const n = Math.min(SCENES_PER_ROUND, SCENE_POOL.length);
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem(RECENT_SCENES_KEY) || "[]"); } catch (e) {}
  if (!Array.isArray(recent)) recent = [];
  const all = shuffled(SCENE_POOL.map((_, i) => i));
  const fresh = all.filter(i => !recent.includes(i));
  const seen = all.filter(i => recent.includes(i));
  const picked = [], feels = new Set();
  for (const i of fresh) {
    if (picked.length >= n) break;
    const f = SCENE_POOL[i].feel[0];
    if (!feels.has(f)) { feels.add(f); picked.push(i); }
  }
  for (const i of [...fresh, ...seen]) {
    if (picked.length >= n) break;
    if (!picked.includes(i)) picked.push(i);
  }
  try { localStorage.setItem(RECENT_SCENES_KEY, JSON.stringify(picked)); } catch (e) {}
  SCENES = shuffled(picked).map(i => ({ ...SCENE_POOL[i], answers: shuffled(SCENE_POOL[i].answers) }));
}
drawScenes();

/* ════════════════════════════════════════════
   2. 저장소 (Firebase Firestore ↔ 체험 모드 localStorage)
   ════════════════════════════════════════════ */
const isConfigured = firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("여기에");
let db = null, fs = null;

async function initDB() {
  if (!isConfigured) return;
  try {
    const [{ initializeApp }, firestore] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"),
    ]);
    fs = firestore;
    db = fs.getFirestore(initializeApp(firebaseConfig));
    const b = $("#modeBadge");
    b.textContent = "☁️ 기록 저장 중"; b.className = "mode-badge live";
  } catch (e) {
    console.error(e);
    toast("파이어베이스 연결에 실패해서 체험 모드로 동작해요.");
  }
}

const LOCAL_KEY = "mood-routine-records";
const localAll = () => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY)) || []; } catch { return []; } };

async function saveRecord(rec) {
  if (db) {
    await fs.addDoc(fs.collection(db, "checkins"), { ...rec, createdAt: fs.serverTimestamp() });
  } else {
    const all = localAll(); all.push({ ...rec, createdAt: Date.now() });
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(all)); } catch {}
  }
}

async function loadClass(classCode) {
  if (db) {
    const snap = await fs.getDocs(fs.query(fs.collection(db, "checkins"), fs.where("classCode", "==", classCode)));
    return snap.docs.map(d => {
      const v = d.data();
      return { ...v, createdAt: v.createdAt?.toMillis ? v.createdAt.toMillis() : Date.now() };
    }).sort((a, b) => b.createdAt - a.createdAt);
  }
  return localAll().filter(r => r.classCode === classCode).sort((a, b) => b.createdAt - a.createdAt);
}

/* ════════════════════════════════════════════
   3. 공통 도우미
   ════════════════════════════════════════════ */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const todayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const INTENSITY = ["", "아주 조금", "조금", "보통", "많이", "아주 많이"];
// 받침에 따라 조사 고르기: josa("인정","이","가") → "인정이"
const josa = (w, a, b) => {
  const c = String(w).trim().slice(-1).charCodeAt(0);
  if (c < 0xac00 || c > 0xd7a3) return w + a;
  return w + ((c - 0xac00) % 28 ? a : b);
};
// 문장 끝 정리: "동생이랑 다퉜어요." → "동생이랑 다퉜어요"
const trimEnd = s => String(s || "").trim().replace(/[.!?~。]+$/, "");

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
function confetti(chars) {
  for (let i = 0; i < 26; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.textContent = chars[i % chars.length];
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDelay = Math.random() * .8 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3400);
  }
}

/* 프로필 (학급 코드 + 별명) */
const profile = {
  get() { try { return JSON.parse(localStorage.getItem("mood-routine-profile")) || {}; } catch { return {}; } },
  set(p) { try { localStorage.setItem("mood-routine-profile", JSON.stringify(p)); } catch {} },
};
function readProfileInputs() {
  const p = { classCode: $("#classCode").value.trim(), nickname: $("#nickname").value.trim() };
  profile.set(p);
  return p;
}

/* ════════════════════════════════════════════
   4. 화면 전환
   ════════════════════════════════════════════ */
const VIEWS = ["home", "routine", "practice", "diary", "teacher"];
function go(view) {
  if (view === "routine") {
    const p = readProfileInputs();
    if (!p.classCode || !p.nickname) {
      view = "home";
      $("#profileMsg").textContent = "⚠️ 학급 코드와 번호(별명)를 먼저 적어 주세요.";
      $("#profileMsg").style.color = "var(--warn)";
      (p.classCode ? $("#nickname") : $("#classCode")).focus();
    } else if (!R.started) startRoutine();
  }
  VIEWS.forEach(v => $("#view-" + v).classList.toggle("hidden", v !== view));
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.go === view));
  if (view === "home") renderStamps();
  if (view === "practice") renderPractice();
  if (view === "diary") renderDiary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g) go(g.dataset.go);
});

/* ════════════════════════════════════════════
   5. 감정이해 루틴 (6단계)
   ════════════════════════════════════════════ */
const R = { started: false };
function startRoutine() {
  Object.assign(R, { started: true, step: 0, emotion: null, intensity: 3, body: [], word: null,
    reason: null, strategy: null, did: false, after: null, note: "", chat: newChat() });
  renderRoutine();
}
function newChat(word = null) {
  return { word, turn: 0, probed: false, typing: false, log: [], situation: "", cause: "", need: "", narrative: "", done: false };
}

/* ── 마음 대화 코치 ──
   상황(언제·어디서) → 원인(무슨 일이·왜) → 바람(정말 바랐던 것) 순서로 묻고,
   대답마다 '되비추기 + 인정 + 다음 질문' 피드백을 줍니다. 너무 짧은 대답에는 한 번 더 질문합니다. */
const COACH = "🦉";
const isThin = s => s.replace(/\s/g, "").length < 4 || /^(몰라|모르겠|그냥|없어|없음|ㅇㅇ|네|응)/.test(s.trim());
const hasCause = s => /(때문|해서|어서|아서|라서|니까|길래|는데|았는데|었는데|못해|안 ?해|싫|해 ?줘)/.test(s);

function coachAsk(turn) {
  const C = R.chat, w = R.word, e = EMOTIONS[R.emotion];
  if (turn === 0) return `오늘 <b>'${esc(w)}'</b> 마음을 찾았구나. 그 마음은 <b>언제, 어디서</b> 찾아왔어?`;
  if (turn === 1) return e.neg
    ? `${esc(trimEnd(C.situation) || "그때")}, <b>무슨 일이 있었길래</b> '${esc(w)}' 마음이 들었을까? 누가, 무엇을 했는지 떠올려 봐.`
    : `${esc(trimEnd(C.situation) || "그때")}, <b>어떤 일이 있었길래</b> '${esc(w)}' 마음이 들었을까?`;
  if (turn === 2) return e.neg
    ? `그때 네 마음속에서 <b>정말 바랐던 건</b> 뭐였을까? 가장 가까운 것을 골라 봐.`
    : `그 일이 너에게 왜 소중했을까? <b>어떤 마음이 채워졌는지</b> 골라 봐.`;
  return "";
}
function coachReply(turn, ans) {
  const C = R.chat, w = R.word, e = EMOTIONS[R.emotion];
  if (!ans) return "괜찮아. 말하고 싶지 않은 것도 소중한 네 마음이야. 다음으로 넘어가 볼게.";
  if (turn === 0) return `<b>'${esc(trimEnd(ans))}'</b> — 그때 그 장면이 눈앞에 그려지는 것 같아.`;
  if (turn === 1) {
    const why = hasCause(ans) ? "이유까지 차근차근 말해 줘서 네 마음이 훨씬 잘 이해돼. " : "그런 일이 있었구나. ";
    return why + (e.neg ? `그런 일이 있으면 <b>'${esc(w)}'</b> 마음이 드는 건 아주 자연스러워.` : `그래서 <b>'${esc(w)}'</b> 마음이 들었구나. 듣는 나도 기분이 좋아져!`);
  }
  if (turn === 2) return e.neg
    ? `<b>${esc(josa(ans, "이", "가"))}</b> 필요했구나. 감정 뒤에는 늘 이런 소중한 바람이 숨어 있어.`
    : `<b>${esc(josa(ans, "이", "가"))}</b> 채워졌구나. 이런 순간을 기억해 두면 힘들 때 꺼내 볼 수 있어.`;
  return "";
}
const PROBES = [
  "조금만 더 알려 줄래? <b>언제</b>(아침, 쉬는 시간…) 그리고 <b>어디서</b>였는지 떠올려 봐.",
  "<b>누가, 무엇을</b> 했는지 한 가지만 더 말해 줄 수 있을까? 예: '친구가 내 말을 끝까지 안 들어서'",
];
function buildNarrative() {
  const C = R.chat, e = EMOTIONS[R.emotion];
  const parts = [];
  if (C.situation) parts.push(trimEnd(C.situation) + ",");
  const cause = trimEnd(C.cause);
  const linked = /(서|니까|는데|길래|고|며|때문에)$/.test(cause); // "~해서"처럼 이어지는 말이면 바로 연결
  if (cause) parts.push(linked ? cause : cause + ".");
  parts.push(`${cause && !linked ? "그래서 " : ""}나는 '${R.word}' 마음이 ${INTENSITY[R.intensity]} 들었어.`);
  if (C.need) parts.push(e.neg ? `나는 ${josa(C.need, "이", "가")} 필요했어.` : `나에게 ${josa(C.need, "이", "가")} 채워졌어.`);
  return parts.join(" ");
}
function exprLevel() {
  const C = R.chat;
  return 1 + (C.situation ? 1 : 0) + (C.cause ? 1 : 0) + (C.need ? 1 : 0);
}
function chatPush(who, html) { R.chat.log.push({ who, html }); }
function chatAnswer(raw) {
  const C = R.chat; const t = C.turn;
  const ans = (raw ?? "").trim().slice(0, 60);
  if (ans) chatPush("me", esc(ans)); else chatPush("me", "<i>말하기 어려워요</i>");
  if (ans && t < 2 && isThin(ans) && !C.probed) {
    C.probed = true; C.pending = ans;
    C.typing = true; renderRoutine();
    setTimeout(() => { C.typing = false; chatPush("bot", PROBES[t]); renderRoutine(); }, 650);
    return;
  }
  // 한 번 더 물었을 때는 앞의 짧은 대답과 이어 붙여 저장
  const full = C.probed && C.pending && ans ? `${C.pending} ${ans}` : (ans || C.pending || "");
  C.probed = false; C.pending = "";
  if (t === 0) C.situation = full; else if (t === 1) C.cause = full; else C.need = full;
  C.typing = true; renderRoutine();
  setTimeout(() => {
    C.typing = false;
    chatPush("bot", coachReply(t, full));
    C.turn++;
    if (C.turn < 3) chatPush("bot", coachAsk(C.turn));
    else {
      C.narrative = buildNarrative();
      const lv = exprLevel();
      chatPush("bot", `네 이야기를 모아 <b>내 마음 문장</b>을 만들어 봤어. ${LEVELS[lv].ico} 지금 문장은 <b>${LEVELS[lv].name}</b>까지 담겨 있어. 내 말투로 고쳐도 좋아!`);
    }
    renderRoutine();
  }, 700);
}
$("#startRoutine").addEventListener("click", () => { R.started = false; go("routine"); });

const STEP_TITLES = ["마음 날씨", "몸의 신호", "이름 붙이기", "마음 대화", "마음 돌보기", "돌아보기"];

function renderMini() {
  const e = EMOTIONS[R.emotion];
  const rows = [
    ["마음 날씨", e ? `${e.wx} ${e.name} (${INTENSITY[R.intensity]})` : "—"],
    ["몸의 신호", R.body.length ? R.body.join(", ") : "—"],
    ["감정 이름", R.word || "—"],
    ["상황", R.chat?.situation || "—"],
    ["원인", R.chat?.cause || "—"],
    ["바람", R.chat?.need || "—"],
    ["돌보기", R.strategy ? STRATEGIES[R.strategy].name : "—"],
  ];
  $("#miniSummary").innerHTML = rows.map(([a, b]) => `<div><span>${a}</span><span>${esc(b)}</span></div>`).join("");
}

function shell(inner, { canNext = true, nextLabel = "다음 →" } = {}) {
  const prog = STEP_TITLES.map((_, i) => `<div class="${i <= R.step ? "on" : ""}"></div>`).join("");
  return `
    <div class="progress">${prog}</div>
    <div class="step-label">STEP ${R.step + 1} / 6 · ${STEP_TITLES[R.step]}</div>
    ${inner}
    <div class="nav-row">
      <button class="btn ghost" id="rPrev" ${R.step === 0 ? "style='visibility:hidden'" : ""}>← 이전</button>
      <button class="btn green" id="rNext" ${canNext ? "" : "disabled"}>${nextLabel}</button>
    </div>`;
}

function renderRoutine() {
  renderMini();
  const card = $("#routineCard");
  const e = EMOTIONS[R.emotion];
  if (e) card.style.setProperty("--c", e.color);
  let html = "";

  if (R.step === 0) {
    const chips = Object.entries(EMOTIONS).map(([k, v]) =>
      `<button class="chip ${R.emotion === k ? "sel" : ""}" style="--c:${v.color}" data-emo="${k}">
         <span class="big">${v.wx}</span>${v.name}<small>${v.weather}</small></button>`).join("");
    html = shell(`
      <h2 class="q">지금 내 마음은 어떤 날씨인가요?</h2>
      <p class="muted" style="margin:0">하나만 골라요. 섞여 있다면 가장 큰 마음을 골라요.</p>
      <div class="chips">${chips}</div>
      ${e ? `<div class="meter"><div class="meter-face" id="mFace">${e.face}</div>
        <label class="field" for="inten">그 마음은 얼마나 큰가요? <b id="intenTxt" style="color:${e.color}">${INTENSITY[R.intensity]}</b></label>
        <input id="inten" type="range" min="1" max="5" value="${R.intensity}">
        <div class="meter-labels"><span>아주 조금</span><span>보통</span><span>아주 많이</span></div></div>` : ""}
    `, { canNext: !!R.emotion });
  }

  if (R.step === 1) {
    const chips = BODY.map(([i, t]) =>
      `<button class="chip ${R.body.includes(t) ? "sel" : ""}" data-body="${esc(t)}"><span class="big">${i}</span>${t}</button>`).join("");
    html = shell(`
      <h2 class="q">${e.wx} ${e.name}일 때, 내 몸은 어떤 신호를 보내나요?</h2>
      <p class="muted" style="margin:0">눈을 감고 몸을 머리부터 발끝까지 살펴봐요. 여러 개 골라도 돼요.</p>
      <div class="chips small">${chips}</div>
      <div class="tip">💡 감정은 몸으로 먼저 찾아와요. 몸의 신호를 알아차리면 감정이 커지기 전에 멈출 수 있어요.</div>
    `, { canNext: R.body.length > 0 });
  }

  if (R.step === 2) {
    const chips = e.words.map(w =>
      `<button class="chip ${R.word === w ? "sel" : ""}" data-word="${w}">${w}</button>`).join("");
    html = shell(`
      <h2 class="q">내 마음에 더 정확한 이름을 붙여 볼까요?</h2>
      <p class="muted" style="margin:0">'${e.name}' 안에도 여러 가지 마음이 있어요. 가장 비슷한 낱말을 골라요.</p>
      <div class="chips small">${chips}</div>
      <div class="sentence">나는 지금 <em>${R.word ? esc(R.word) : "○○한"}</em> 마음이 <em>${INTENSITY[R.intensity]}</em> 들어요.</div>
      <div class="tip">💡 감정에 이름을 붙이기만 해도 마음이 조금 가라앉아요. 이것을 '감정 이름 붙이기'라고 해요.</div>
    `, { canNext: !!R.word });
  }

  if (R.step === 3) {
    const C = R.chat;
    if (C.word !== R.word) { R.chat = newChat(R.word); chatPush("bot", coachAsk(0)); }
    const C2 = R.chat;
    const log = C2.log.map(m => `<div class="msg ${m.who}">${m.who === "bot" ? `<span class="av">${COACH}</span>` : ""}<div class="bubble">${m.html}</div></div>`).join("")
      + (C2.typing ? `<div class="msg bot"><span class="av">${COACH}</span><div class="bubble typing"><i></i><i></i><i></i></div></div>` : "");
    let input = "";
    if (C2.turn < 3 && !C2.typing) {
      const quick = C2.turn === 0 ? SITUATION_CHIPS.map(s => `<button class="qchip" data-quick="${esc(s)}">${s}</button>`).join("")
                  : C2.turn === 1 ? REASONS.slice(0, 7).map(([i, t]) => `<button class="qchip ${R.reason === t ? "sel" : ""}" data-rcat="${esc(t)}">${i} ${t}</button>`).join("")
                  : NEEDS.map(([i, t]) => `<button class="qchip" data-need="${esc(t)}">${i} ${t}</button>`).join("");
      const quickLabel = ["빠르게 고르고 이어서 써도 돼요", "어떤 일과 관련 있나요? (선택)", "골라서 보내요"][C2.turn];
      input = `
        <div class="quick"><span class="muted">${quickLabel}</span><div>${quick}</div></div>
        ${C2.turn < 2 ? `<form class="chat-input" id="chatForm">
          <input id="chatText" class="input" maxlength="60" autocomplete="off" placeholder="${C2.turn === 0 ? "예: 쉬는 시간에 교실에서" : "예: 친구가 내 차례인데 먼저 해서"}">
          <button class="btn green" type="submit">보내기</button></form>` : ""}
        <button class="skip" id="chatSkip">🙊 말하기 어려워요</button>`;
    }
    const lv = exprLevel();
    const summary = C2.turn >= 3 ? `
      <div class="narrative">
        <div class="row spread"><b>📝 내 마음 문장</b><span class="lv">${LEVELS[lv].ico} ${lv}단계 · ${LEVELS[lv].name}</span></div>
        <div class="lv-track">${[1, 2, 3, 4].map(i => `<div class="${i <= lv ? "on" : ""}"><span>${LEVELS[i].ico}</span>${["감정", "+상황", "+원인", "+바람"][i - 1]}</div>`).join("")}</div>
        <textarea id="narr" class="input" rows="3" maxlength="200">${esc(C2.narrative)}</textarea>
        <p class="muted" style="margin:6px 0 0;font-size:13.5px">💡 ${LEVELS[lv].tip}</p>
      </div>` : "";
    html = shell(`
      <h2 class="q">마음 부엉이와 이야기해요</h2>
      <p class="muted" style="margin:0">'${esc(R.word)}' 마음이 어디서 왔는지 함께 살펴봐요. 정답은 없어요.</p>
      <div class="chat" id="chat">${log}</div>
      ${input}${summary}
    `, { canNext: C2.turn >= 3, nextLabel: C2.turn >= 3 ? "이 문장으로 정했어요 →" : "대화를 마치면 넘어갈 수 있어요" });
  }

  if (R.step === 4) {
    const rec = RECOMMEND[R.emotion];
    const others = Object.keys(STRATEGIES).filter(k => !rec.includes(k));
    const chip = k => `<button class="chip ${R.strategy === k ? "sel" : ""}" data-strat="${k}">
        <span class="big">${STRATEGIES[k].ico}</span>${STRATEGIES[k].name}<small>${STRATEGIES[k].desc}</small></button>`;
    html = shell(`
      <h2 class="q">${e.neg ? "내 마음을 돌봐 줄 방법을 골라요" : "좋은 마음을 더 키울 방법을 골라요"}</h2>
      <p class="muted" style="margin:0"><b>${e.wx} ${e.name}</b> 마음에 추천하는 방법이에요. 골라서 직접 해 봐요.</p>
      <div class="chips">${rec.map(chip).join("")}</div>
      <details style="margin-bottom:6px"><summary class="muted" style="cursor:pointer">다른 방법도 보기</summary>
        <div class="chips">${others.map(chip).join("")}</div></details>
      <div id="activity"></div>
    `, { canNext: R.did, nextLabel: R.did ? "다음 →" : "활동을 마치면 넘어갈 수 있어요" });
  }

  if (R.step === 5) {
    if (R.after == null) R.after = R.intensity;
    html = shell(`
      <h2 class="q">마음을 돌본 뒤, 지금은 어때요?</h2>
      <div class="meter">
        <label class="field" for="after">처음 <b>${INTENSITY[R.intensity]}</b>이었던 '${esc(R.word)}' 마음이 지금은…
          <b id="afterTxt" style="color:${e.color}">${INTENSITY[R.after]}</b></label>
        <input id="after" type="range" min="1" max="5" value="${R.after}">
        <div class="meter-labels"><span>아주 조금</span><span>보통</span><span>아주 많이</span></div>
      </div>
      <div class="msg bot" style="margin-top:16px"><span class="av">${COACH}</span><div class="bubble">
        ${e.neg ? `다음에 <b>비슷한 일</b>이 또 생기면, 오늘 알게 된 걸 떠올려서 <b>어떻게 해 보고 싶어?</b>`
                : `이 좋은 마음을 <b>다시 만나려면</b> 어떻게 하면 좋을까? 또는 누구와 <b>나누고 싶어?</b>`}</div></div>
      <label class="field" for="note" style="margin-top:10px">돌아보기 한 줄 (선택, 80자)</label>
      <input id="note" class="input" maxlength="80" placeholder="${e.neg ? "예: 다음엔 바로 화내지 않고 숨 쉬고 '내 차례야'라고 말할래요" : "예: 친구에게 고맙다고 먼저 말해 볼래요"}" value="${esc(R.note)}">
      ${e.neg && R.after >= 4 ? `<div class="tip warn">🫂 아직 마음이 많이 무겁다면 혼자 견디지 않아도 돼요. 선생님이나 믿을 수 있는 어른에게 꼭 이야기해요.</div>` : ""}
    `, { nextLabel: "💾 오늘의 마음 저장하기" });
  }

  if (R.step === 6) { renderDone(); return; }

  card.innerHTML = html;
  bindRoutine();
  if (R.step === 4 && R.strategy) renderActivity();
}

function bindRoutine() {
  const card = $("#routineCard");
  card.querySelectorAll("[data-emo]").forEach(b => b.onclick = () => {
    if (R.emotion !== b.dataset.emo) { R.word = null; R.strategy = null; R.did = false; }
    R.emotion = b.dataset.emo; renderRoutine();
  });
  const inten = $("#inten");
  if (inten) inten.oninput = () => {
    R.intensity = +inten.value;
    $("#intenTxt").textContent = INTENSITY[R.intensity];
    $("#mFace").style.transform = `scale(${0.8 + R.intensity * 0.12})`;
    renderMini();
  };
  card.querySelectorAll("[data-body]").forEach(b => b.onclick = () => {
    const t = b.dataset.body;
    R.body = R.body.includes(t) ? R.body.filter(x => x !== t) : [...R.body, t];
    renderRoutine();
  });
  card.querySelectorAll("[data-word]").forEach(b => b.onclick = () => { R.word = b.dataset.word; renderRoutine(); });
  // 마음 대화
  const chat = $("#chat");
  if (chat) chat.scrollTop = chat.scrollHeight;
  const cf = $("#chatForm");
  if (cf) {
    const ti = $("#chatText");
    if (R.chat.draft) ti.value = R.chat.draft;
    ti.oninput = () => { R.chat.draft = ti.value; };
    ti.focus({ preventScroll: true });
    cf.onsubmit = ev => {
      ev.preventDefault();
      if (!ti.value.trim()) return toast("한 낱말이라도 써 보거나, '말하기 어려워요'를 눌러요.");
      R.chat.draft = ""; chatAnswer(ti.value);
    };
  }
  card.querySelectorAll("[data-quick]").forEach(b => b.onclick = () => {
    const ti = $("#chatText"); ti.value = b.dataset.quick + " "; R.chat.draft = ti.value; ti.focus();
  });
  card.querySelectorAll("[data-rcat]").forEach(b => b.onclick = () => {
    R.reason = R.reason === b.dataset.rcat ? null : b.dataset.rcat;
    card.querySelectorAll("[data-rcat]").forEach(x => x.classList.toggle("sel", x.dataset.rcat === R.reason));
  });
  card.querySelectorAll("[data-need]").forEach(b => b.onclick = () => chatAnswer(b.dataset.need));
  const sk = $("#chatSkip");
  if (sk) sk.onclick = () => { R.chat.draft = ""; chatAnswer(""); };
  const narr = $("#narr");
  if (narr) narr.oninput = () => { R.chat.narrative = narr.value; };
  card.querySelectorAll("[data-strat]").forEach(b => b.onclick = () => {
    stopBreath(); R.strategy = b.dataset.strat; R.did = false; renderRoutine();
    $("#activity").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  const af = $("#after");
  if (af) af.oninput = () => {
    const prevHigh = R.after >= 4;
    R.after = +af.value; $("#afterTxt").textContent = INTENSITY[R.after];
    if (prevHigh !== (R.after >= 4)) { R.note = $("#note").value; renderRoutine(); }
  };
  const nt = $("#note");
  if (nt) nt.oninput = () => { R.note = nt.value; };

  $("#rPrev").onclick = () => { stopBreath(); R.step--; renderRoutine(); };
  $("#rNext").onclick = async () => {
    stopBreath();
    if (R.step === 5) {
      R.note = $("#note").value.trim();
      $("#rNext").disabled = true; $("#rNext").textContent = "저장하는 중…";
      try { await submitRoutine(); } catch (err) {
        console.error(err);
        toast("저장에 실패했어요. 인터넷 연결이나 보안 설정을 확인해 주세요.");
        $("#rNext").disabled = false; $("#rNext").textContent = "💾 다시 저장하기";
        return;
      }
    }
    R.step++; renderRoutine();
    $("#routineCard").scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

/* ── 마음 돌보기 활동 ── */
let breathTimer = null;
function stopBreath() { if (breathTimer) { clearTimeout(breathTimer); breathTimer = null; } }
function markDid() {
  R.did = true;
  const n = $("#rNext"); n.disabled = false; n.textContent = "다음 →";
  renderMini();
  // 활동 상자 바로 아래에 '다음 단계로' 버튼을 보여 줘서, 화면 맨 아래 버튼을 못 찾는 일이 없게 함
  const box = $("#activity .activity");
  if (box && !box.querySelector(".act-done")) {
    const d = document.createElement("div");
    d.className = "act-done";
    d.innerHTML = `<p>✅ 활동을 마쳤어요! 정말 잘했어요.</p><button class="btn green" type="button">다음 단계로 →</button>`;
    d.querySelector("button").onclick = () => $("#rNext").click();
    box.appendChild(d);
    d.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function renderActivity() {
  const box = $("#activity");
  const s = R.strategy;
  const head = `<h3 class="title-font" style="font-size:22px">${STRATEGIES[s].ico} ${STRATEGIES[s].name}</h3>`;

  if (s === "breath") {
    box.innerHTML = `<div class="activity">${head}
      <div class="balloon-wrap"><div class="balloon" id="balloon"></div></div>
      <div class="breath-text" id="bText">준비되면 시작을 눌러요</div>
      <p class="muted" id="bCount" style="margin:4px 0 12px">3번 반복해요</p>
      <button class="btn" id="bStart">🎈 시작</button></div>`;
    $("#bStart").onclick = () => {
      $("#bStart").classList.add("hidden");
      const phases = [["코로 천천히 들이마셔요… 🌬️", 1.9], ["숨을 잠깐 멈춰요… ✋", 1.9], ["입으로 후— 내쉬어요… 🍃", 1]];
      let round = 0, ph = 0;
      const tick = () => {
        if (ph === 3) { ph = 0; round++; }
        if (round === 3) {
          $("#bText").textContent = "잘했어요! 몸이 조금 편안해졌나요? 😌";
          $("#bCount").textContent = "풍선 호흡 3번 완료";
          markDid(); breathTimer = null; return;
        }
        const [txt, scale] = phases[ph];
        $("#bText").textContent = txt;
        $("#bCount").textContent = `${round + 1} / 3번째`;
        $("#balloon").style.transform = `scale(${scale})`;
        ph++;
        breathTimer = setTimeout(tick, 4000);
      };
      tick();
    };
  }

  if (s === "senses") {
    const items = [["👀", 5, "보이는 것"], ["✋", 4, "만질 수 있는 것"], ["👂", 3, "들리는 소리"], ["👃", 2, "맡을 수 있는 냄새"], ["👅", 1, "입 안의 맛 또는 좋아하는 맛"]];
    box.innerHTML = `<div class="activity">${head}
      <p class="muted">주변을 둘러보며 하나씩 찾아요. 찾으면 체크해요.</p>
      <ul class="senses">${items.map(([i, n, t], idx) =>
        `<li><label><input type="checkbox" data-sense="${idx}"> ${i} ${t} <b>${n}가지</b> 찾기</label></li>`).join("")}</ul></div>`;
    box.querySelectorAll("[data-sense]").forEach(c => c.onchange = () => {
      if ([...box.querySelectorAll("[data-sense]")].every(x => x.checked)) { markDid(); toast("지금 여기로 마음이 돌아왔어요 🌱"); }
    });
  }

  if (s === "imsg") {
    box.innerHTML = `<div class="activity">${head}
      <div class="i-msg">
        나는 <input id="im1" maxlength="40" placeholder="어떤 일이 있었을 때" style="width:200px" value="${esc(trimEnd(R.chat.cause).slice(0, 40))}"> ,<br>
        <b style="color:var(--c)">${esc(R.word)}</b> 마음이 들었어.<br>
        왜냐하면 <input id="im2" maxlength="30" placeholder="내가 바랐던 것" style="width:200px" value="${esc(R.chat.need ? R.chat.need + "을(를) 바랐던 것" : "")}"> 이었거든.<br>
        다음에는 <input id="im3" maxlength="30" placeholder="상대에게 바라는 행동" style="width:200px"> 해 주면 좋겠어.
      </div>
      <div class="sentence" id="imOut" style="margin-top:14px;font-size:16px">빈칸을 채우면 나의 말이 완성돼요.</div>
      <button class="btn" id="imDone" style="margin-top:6px">소리 내어 읽어 봤어요</button></div>`;
    const upd = () => {
      const [a, b, c] = ["#im1", "#im2", "#im3"].map(x => $(x).value.trim());
      $("#imOut").textContent = a && b && c ? `"나는 ${a} ${R.word} 마음이 들었어. 왜냐하면 ${b} 이었거든. 다음에는 ${c} 해 주면 좋겠어."` : "빈칸을 채우면 나의 말이 완성돼요.";
    };
    ["#im1", "#im2", "#im3"].forEach(x => $(x).oninput = upd);
    if (R.chat.cause) toast("🦉 마음 대화에서 한 이야기를 빈칸에 미리 넣어 두었어요.");
    $("#imDone").onclick = () => {
      if (["#im1", "#im2", "#im3"].some(x => !$(x).value.trim())) return toast("빈칸 세 개를 모두 채워 주세요.");
      R.imsg = $("#imOut").textContent; markDid(); toast("탓하지 않고 내 마음을 말했어요 👏");
    };
  }

  if (s === "helper") {
    const people = ["👩‍🏫 담임 선생님", "🏫 상담 선생님", "👨‍👩‍👧 가족", "🧑‍🤝‍🧑 친한 친구", "📞 청소년 상담 1388"];
    box.innerHTML = `<div class="activity">${head}
      <p>내 마음을 이야기할 수 있는 사람을 골라요. (여러 명도 좋아요)</p>
      <div class="chips small" style="margin:10px 0">${people.map(p => `<button class="chip" data-helper>${p}</button>`).join("")}</div>
      <div class="tip" style="text-align:left">💬 이렇게 시작해 봐요: "저 요즘 ${esc(R.word)} 마음이 들어서 이야기하고 싶어요."</div></div>`;
    box.querySelectorAll("[data-helper]").forEach(b => b.onclick = () => { b.classList.toggle("sel"); markDid(); });
  }

  if (s === "share" || s === "thanks") {
    const isShare = s === "share";
    box.innerHTML = `<div class="activity">${head}
      <p>${isShare ? "이 좋은 마음을 누구와 어떻게 나누고 싶나요?" : "오늘 고마운 사람이나 일은 무엇인가요?"}</p>
      <input id="posText" class="input" maxlength="50" placeholder="${isShare ? "예: 짝꿍에게 하이파이브 해 주기" : "예: 우산을 같이 써 준 친구"}">
      <button class="btn" id="posDone" style="margin-top:12px">${isShare ? "🎁 나누기 약속" : "✍️ 적었어요"}</button></div>`;
    $("#posDone").onclick = () => {
      const v = $("#posText").value.trim();
      if (!v) return toast("한 줄을 적어 주세요.");
      R.posText = v; markDid(); confetti(["✨", "💛", "🌟"]);
    };
  }

  if (s === "stretch") {
    const moves = ["🙆 두 팔을 머리 위로 쭉 — 5초", "🤸 옆구리 늘리기 좌우 — 5초씩", "🔄 어깨 뒤로 크게 돌리기 — 5번", "👐 손바닥 비벼 눈에 대기 — 5초"];
    box.innerHTML = `<div class="activity">${head}
      <ul class="senses">${moves.map((m, i) => `<li><label><input type="checkbox" data-move="${i}"> ${m}</label></li>`).join("")}</ul></div>`;
    box.querySelectorAll("[data-move]").forEach(c => c.onchange = () => {
      if ([...box.querySelectorAll("[data-move]")].every(x => x.checked)) { markDid(); toast("몸이 깨어났어요! 🌞"); }
    });
  }
}

/* ── 저장 & 완료 ── */
async function submitRoutine() {
  const p = profile.get();
  const rec = {
    classCode: p.classCode.slice(0, 20), nickname: p.nickname.slice(0, 20), dateKey: todayKey(),
    emotion: R.emotion, intensity: R.intensity, body: R.body.slice(0, 12), word: R.word,
    reason: R.reason || "", strategy: R.strategy,
    situation: (R.chat.situation || "").slice(0, 120), cause: (R.chat.cause || "").slice(0, 120),
    need: (R.chat.need || "").slice(0, 30), narrative: (R.chat.narrative || buildNarrative()).trim().slice(0, 200),
    level: exprLevel(), after: R.after, note: (R.note || "").slice(0, 80),
  };
  await saveRecord(rec);
}

function renderDone() {
  const e = EMOTIONS[R.emotion];
  const diff = R.intensity - R.after;
  const msg = e.neg
    ? (diff > 0 ? "마음을 돌봤더니 무거운 마음이 가벼워졌어요. 스스로 해낸 거예요!" : "마음이 그대로여도 괜찮아요. 알아차린 것만으로도 큰 한 걸음이에요.")
    : (diff < 0 ? "좋은 마음이 더 커졌어요! 오늘 하루도 반짝이길 바라요." : "좋은 마음을 잘 알아차렸어요. 그 마음을 오래 간직해요.");
  $("#routineCard").innerHTML = `
    <div class="progress">${STEP_TITLES.map(() => `<div class="on"></div>`).join("")}</div>
    <div class="done-card">
      <div class="wx">${e.wx}</div>
      <span class="eyebrow">오늘의 마음 카드 · ${todayKey()}</span>
      <h2 class="title-font" style="font-size:30px;margin:12px 0 4px">나는 오늘 <span style="color:${e.color}">${esc(R.word)}</span> 마음이었어요</h2>
      <div class="compare"><span>처음 ${INTENSITY[R.intensity]}</span><span class="arrow">→</span><span style="color:${e.color}">지금 ${INTENSITY[R.after]}</span></div>
      <p>${msg}</p>
      <div class="narrative" style="text-align:left">
        <div class="row spread"><b>📝 내 마음 문장</b><span class="lv">${LEVELS[exprLevel()].ico} ${exprLevel()}단계 · ${LEVELS[exprLevel()].name}</span></div>
        <p style="margin:8px 0 0;font-size:17px">${esc(R.chat.narrative || buildNarrative())}</p>
      </div>
      ${R.note ? `<div class="sentence" style="font-size:17px">🔁 "${esc(R.note)}"</div>` : ""}
      <p class="muted" style="font-size:14px">${db ? "☁️ 기록이 우리 반 마음 날씨에 저장되었어요." : "체험 모드라 이 기기에만 저장되었어요."}</p>
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn green" data-go="diary">📒 내 기록장 보기</button>
        <button class="btn ghost" data-go="practice">👀 친구 마음 읽기</button>
        <button class="btn ghost" data-go="home">처음으로</button>
      </div>
    </div>`;
  R.started = false;
  renderMini();
  confetti([e.wx, "⭐", "💛"]);
}

/* ════════════════════════════════════════════
   6. 친구 마음 읽기 (연습)
   ════════════════════════════════════════════ */
const P = { idx: 0, phase: "feel", picked: [], answered: null, score: 0, done: false };
function renderPractice() {
  const card = $("#practiceCard");
  if (P.done) {
    card.innerHTML = `<div class="done-card"><div class="wx">🏅</div>
      <h2 class="title-font" style="font-size:30px;margin:10px 0">친구 마음 읽기 완료!</h2>
      <p>${SCENES.length}개 장면 중 <b>${P.score}개</b>에서 마음을 가장 잘 알아주는 말을 골랐어요.</p>
      <p class="muted">공감은 '정답 맞히기'가 아니라 친구의 마음을 궁금해하는 것에서 시작해요.</p>
      <div class="row" style="justify-content:center;margin-top:12px">
        <button class="btn green" id="pAgain">다시 하기</button><button class="btn ghost" data-go="home">처음으로</button></div></div>`;
    $("#pAgain").onclick = () => { drawScenes(); Object.assign(P, { idx: 0, phase: "feel", picked: [], answered: null, checked: false, score: 0, done: false }); renderPractice(); };
    return;
  }
  const s = SCENES[P.idx];
  const who = nick(s.who);
  const progress = SCENES.map((_, i) => `<div class="${i <= P.idx ? "on" : ""}"></div>`).join("");
  let body = "";
  if (P.phase === "feel") {
    const ok = P.picked.length > 0;
    const right = P.picked.filter(k => s.feel.includes(k));
    body = `
      <h3 class="q" style="font-size:24px">1. ${who}의 마음은 어떤 날씨일까요?</h3>
      <p class="muted" style="margin:0">단서: ${s.clue} · 여러 개를 골라도 돼요.</p>
      <div class="chips small">${Object.entries(EMOTIONS).map(([k, v]) =>
        `<button class="chip ${P.picked.includes(k) ? "sel" : ""}" style="--c:${v.color}" data-pf="${k}"><span class="big">${v.wx}</span>${v.name}</button>`).join("")}</div>
      ${P.checked ? `<div class="feedback" style="background:${right.length ? "#e8f7f0" : "#fff6df"}">
        ${right.length ? `👍 맞아요! ${who}는 ${s.feel.map(k => EMOTIONS[k].name).join(", ")} 같은 마음이 들 수 있어요.`
                       : `🤔 다시 단서를 볼까요? ${who}는 ${s.feel.map(k => EMOTIONS[k].name).join(", ")} 같은 마음일 수 있어요.`}</div>` : ""}
      <div class="nav-row"><span></span>
        ${P.checked ? `<button class="btn green" id="pToSay">공감하는 말 고르기 →</button>`
                    : `<button class="btn green" id="pCheck" ${ok ? "" : "disabled"}>확인하기</button>`}</div>`;
  } else {
    body = `
      <h3 class="q" style="font-size:24px">2. ${who}에게 어떤 말을 건넬까요?</h3>
      ${s.answers.map((a, i) => `<button class="answer ${P.answered != null ? a.k : ""}" data-pa="${i}" ${P.answered != null ? "disabled" : ""}>
        ${P.answered != null ? (a.k === "good" ? "💚 " : a.k === "bad" ? "💔 " : "🤏 ") : ""}${esc(a.t)}</button>`).join("")}
      ${P.answered != null ? `<div class="feedback" style="background:${s.answers[P.answered].k === "good" ? "#e8f7f0" : "#fff6df"}">${esc(s.answers[P.answered].f)}</div>
        <div class="nav-row"><span></span><button class="btn green" id="pNext">${P.idx === SCENES.length - 1 ? "결과 보기 🏅" : "다음 장면 →"}</button></div>` : ""}`;
  }
  card.innerHTML = `
    <div class="row spread"><span class="eyebrow">친구 마음 읽기 · 장면 ${P.idx + 1} / ${SCENES.length}</span><span class="muted" style="font-size:14px">💚 ${P.score}</span></div>
    <div class="progress" style="margin-top:12px">${progress}</div>
    <div class="scene"><div class="face">${s.face}</div>
      <div><span class="pill">${s.place}</span><p style="font-size:17.5px;font-weight:600;margin-top:8px">${s.text}</p></div></div>
    <div style="margin-top:18px">${body}</div>`;

  card.querySelectorAll("[data-pf]").forEach(b => b.onclick = () => {
    if (P.checked) return;
    const k = b.dataset.pf;
    P.picked = P.picked.includes(k) ? P.picked.filter(x => x !== k) : [...P.picked, k];
    renderPractice();
  });
  $("#pCheck") && ($("#pCheck").onclick = () => { P.checked = true; renderPractice(); });
  $("#pToSay") && ($("#pToSay").onclick = () => { P.phase = "say"; renderPractice(); });
  card.querySelectorAll("[data-pa]").forEach(b => b.onclick = () => {
    P.answered = +b.dataset.pa;
    if (s.answers[P.answered].k === "good") P.score++;
    renderPractice();
  });
  $("#pNext") && ($("#pNext").onclick = () => {
    if (P.idx === SCENES.length - 1) P.done = true;
    else Object.assign(P, { idx: P.idx + 1, phase: "feel", picked: [], answered: null, checked: false });
    renderPractice(); window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ════════════════════════════════════════════
   7. 나의 기록장 & 도장
   ════════════════════════════════════════════ */
async function myRecords() {
  const p = profile.get();
  if (!p.classCode || !p.nickname) return null;
  return (await loadClass(p.classCode)).filter(r => r.nickname === p.nickname);
}

async function renderStamps() {
  const p = profile.get();
  $("#classCode").value = p.classCode || "";
  $("#nickname").value = p.nickname || "";
  const line = $("#stampLine");
  let recs = [];
  try { recs = (await myRecords()) || []; } catch (e) { console.error(e); }
  const days = [...new Set(recs.map(r => r.dateKey))];
  const now = new Date(); const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const week = Array.from({ length: 5 }, (_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  line.innerHTML = week.map((d, i) => {
    const key = todayKey(d); const r = recs.find(x => x.dateKey === key);
    return `<div style="text-align:center"><div class="stamp ${r ? "got" : ""}" title="${key}">${r ? EMOTIONS[r.emotion]?.wx || "⭐" : ""}</div>
      <small class="muted">${"월화수목금"[i]}</small></div>`;
  }).join("");
  $("#stampTitle").textContent = p.nickname ? `${p.nickname}님, 지금까지 ${days.length}일 기록했어요` : "이름표를 먼저 적어 주세요";
}

async function renderDiary() {
  const body = $("#diaryBody");
  const p = profile.get();
  if (!p.classCode || !p.nickname) {
    body.innerHTML = `<div class="tip warn">처음 화면에서 학급 코드와 번호(별명)를 먼저 적어 주세요. <button class="btn ghost" data-go="home" style="margin-left:8px;padding:6px 12px">처음으로</button></div>`;
    return;
  }
  $("#diaryTitle").textContent = `${p.nickname}의 마음 기록장`;
  body.innerHTML = `<p class="muted">불러오는 중…</p>`;
  let recs;
  try { recs = await myRecords(); } catch (e) { console.error(e); body.innerHTML = `<div class="tip warn">기록을 불러오지 못했어요.</div>`; return; }
  if (!recs.length) { body.innerHTML = `<div class="tip">아직 기록이 없어요. 오늘의 마음 루틴부터 시작해 볼까요? <button class="btn green" data-go="routine" style="margin-left:8px;padding:6px 12px">시작</button></div>`; return; }

  const count = {}; recs.forEach(r => count[r.emotion] = (count[r.emotion] || 0) + 1);
  const max = Math.max(...Object.values(count));
  const negs = recs.filter(r => EMOTIONS[r.emotion]?.neg);
  const eased = negs.filter(r => r.after < r.intensity).length;
  const stratCount = {}; recs.forEach(r => stratCount[r.strategy] = (stratCount[r.strategy] || 0) + 1);
  const fav = Object.entries(stratCount).sort((a, b) => b[1] - a[1])[0];

  body.innerHTML = `
    <div class="stat-row">
      <div class="stat"><b>${recs.length}</b><span>마음을 기록한 횟수</span></div>
      <div class="stat"><b>${EMOTIONS[Object.entries(count).sort((a, b) => b[1] - a[1])[0][0]].wx}</b><span>가장 자주 찾아온 날씨</span></div>
      <div class="stat"><b>${negs.length ? Math.round(eased / negs.length * 100) + "%" : "—"}</b><span>무거운 마음이 가벼워진 비율</span></div>
      <div class="stat"><b>${fav ? STRATEGIES[fav[0]]?.ico : "—"}</b><span>자주 쓴 돌보기: ${fav ? STRATEGIES[fav[0]]?.name : ""}</span></div>
    </div>
    <h3 style="margin-top:6px">나에게 찾아온 마음 날씨</h3>
    <div class="bars">${Object.entries(EMOTIONS).map(([k, v]) => `
      <div class="bar-line"><span>${v.wx} ${v.name}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(count[k] || 0) / max * 100}%;background:${v.color}"></div></div>
        <span>${count[k] || 0}</span></div>`).join("")}</div>
    ${growthBlock(recs)}
    <h3 style="margin-top:22px">마음 일기</h3>
    <div class="diary">${recs.slice(0, 30).map(r => {
      const e = EMOTIONS[r.emotion] || EMOTIONS.calm;
      return `<div class="entry" style="--c:${e.color}">
        <div class="d">${esc(r.dateKey)}${r.level ? ` · ${LEVELS[r.level].ico} ${r.level}단계` : ""}</div>
        <b>${e.wx} ${esc(r.word)}</b> <span class="muted" style="font-size:13px">${INTENSITY[r.intensity]} → ${INTENSITY[r.after]}</span>
        <div style="font-size:13.5px;margin-top:4px">📝 ${esc(r.narrative || r.reasonText || r.reason || "")}</div>
        <div style="font-size:13.5px">🌱 ${esc(STRATEGIES[r.strategy]?.name || "")}</div>
        ${r.note ? `<div style="font-size:13.5px;margin-top:4px">🔁 ${esc(r.note)}</div>` : ""}</div>`;
    }).join("")}</div>`;
}

// 마음 문장 성장: 감정 낱말 → 상황 → 원인 → 바람까지 표현이 넓어지는 과정
function growthBlock(recs) {
  const seq = recs.filter(r => r.level).slice(0, 10).reverse(); // 오래된 것 → 최근
  if (!seq.length) return "";
  const avgOf = a => a.reduce((s, r) => s + r.level, 0) / a.length;
  const k = Math.max(1, Math.min(3, Math.floor(seq.length / 2))); // 앞쪽 k개 vs 뒤쪽 k개 (겹치지 않게)
  const first = avgOf(seq.slice(0, k)), last = avgOf(seq.slice(-k));
  const msg = seq.length < 2 ? "기록이 쌓이면 내 마음 문장이 어떻게 자라는지 볼 수 있어요."
    : last > first ? `처음보다 마음을 <b>더 자세히</b> 설명하게 되었어요! (평균 ${first.toFixed(1)} → ${last.toFixed(1)}단계)`
    : last >= 3.5 ? "상황·원인·바람까지 담아 마음을 깊이 들여다보고 있어요."
    : `다음 루틴에서는 ${LEVELS[Math.min(4, Math.round(last))].tip.replace("다음에는 ", "")}`;
  return `
    <h3 style="margin-top:22px">📝 내 마음 문장이 자라요</h3>
    <div class="growth">${seq.map(r => `
      <div class="g-col" title="${esc(r.dateKey)} · ${LEVELS[r.level].name}">
        <div class="g-bar" style="height:${r.level * 25}%;background:${EMOTIONS[r.emotion]?.color || "var(--accent)"}"><span>${LEVELS[r.level].ico}</span></div>
        <small>${esc(r.dateKey.slice(5).replace("-", "/"))}</small></div>`).join("")}
    </div>
    <div class="lv-legend">${[1, 2, 3, 4].map(i => `<span>${LEVELS[i].ico} ${i}단계 ${LEVELS[i].name}</span>`).join("")}</div>
    <div class="tip">${msg}</div>`;
}

/* ════════════════════════════════════════════
   8. 선생님 화면
   ════════════════════════════════════════════ */
$("#tDate").value = todayKey();
$("#tClass").value = profile.get().classCode || "";
$("#tOpen").onclick = async () => {
  const code = $("#tClass").value.trim();
  if (!code) return ($("#tMsg").textContent = "학급 코드를 입력해 주세요.");
  if ($("#tPin").value !== TEACHER_PIN) return ($("#tMsg").textContent = "비밀번호가 맞지 않아요.");
  $("#tMsg").textContent = "불러오는 중…";
  try { renderTeacher(code, $("#tDate").value, await loadClass(code)); $("#tMsg").textContent = ""; }
  catch (e) { console.error(e); $("#tMsg").textContent = "불러오지 못했어요. 파이어베이스 설정과 보안 규칙을 확인해 주세요."; }
};

function renderTeacher(code, date, all) {
  const recs = all.filter(r => r.dateKey === date);
  const latest = {}; recs.forEach(r => { if (!latest[r.nickname]) latest[r.nickname] = r; });
  const people = Object.values(latest);
  const count = {}; people.forEach(r => count[r.emotion] = (count[r.emotion] || 0) + 1);
  const max = Math.max(1, ...Object.values(count));
  const avg = k => people.length ? (people.reduce((s, r) => s + r[k], 0) / people.length).toFixed(1) : "—";
  const care = people.filter(r => EMOTIONS[r.emotion]?.neg && r.after >= 4);
  const top = Object.entries(count).sort((a, b) => b[1] - a[1])[0];
  const lvPeople = people.filter(r => r.level);
  const lvCount = [0, 0, 0, 0, 0]; lvPeople.forEach(r => lvCount[r.level]++);
  // 학생별 표현 단계 변화: 처음 3번 평균 → 최근 3번 평균 (전체 기간)
  const byKid = {}; [...all].reverse().forEach(r => { if (r.level) (byKid[r.nickname] ||= []).push(r.level); });
  const growth = Object.entries(byKid).filter(([, a]) => a.length >= 2).map(([n, a]) => {
    const k = Math.min(3, Math.floor(a.length / 2));
    const f = a.slice(0, k), l = a.slice(-k);
    return { n, from: f.reduce((s, x) => s + x, 0) / f.length, to: l.reduce((s, x) => s + x, 0) / l.length, cnt: a.length };
  }).sort((a, b) => (b.to - b.from) - (a.to - a.from));

  $("#teacherBody").innerHTML = `
    <div class="card" style="margin-top:18px">
      <div class="row spread"><div><span class="eyebrow">${esc(code)} · ${esc(date)}</span>
        <h2 class="title-font" style="font-size:28px;margin:8px 0 0">오늘 우리 반 마음 날씨: ${top ? EMOTIONS[top[0]].wx + " " + EMOTIONS[top[0]].weather : "아직 기록 없음"}</h2></div>
        <button class="btn ghost" id="tRefresh">🔄 새로고침</button></div>
      <div class="stat-row">
        <div class="stat"><b>${people.length}</b><span>참여 학생 수</span></div>
        <div class="stat"><b>${avg("intensity")} → ${avg("after")}</b><span>감정 크기 평균 (루틴 전 → 후, 5점)</span></div>
        <div class="stat"><b>${lvPeople.length ? (lvPeople.reduce((s, r) => s + r.level, 0) / lvPeople.length).toFixed(1) : "—"}</b><span>마음 문장 표현 단계 평균 (4단계)</span></div>
        <div class="stat"><b style="color:${care.length ? "var(--angry)" : "var(--calm)"}">${care.length}</b><span>살펴볼 친구</span></div>
      </div>
      <div class="grid2" style="margin-top:0">
        <div><h3>감정 분포</h3><div class="bars">${Object.entries(EMOTIONS).map(([k, v]) => `
          <div class="bar-line"><span>${v.wx} ${v.name}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${(count[k] || 0) / max * 100}%;background:${v.color}"></div></div>
            <span>${count[k] || 0}</span></div>`).join("")}</div></div>
        <div><h3>🫂 오늘 먼저 말 걸어 볼 친구</h3>
          ${care.length ? `<ul class="alert-list">${care.map(r => `<li><b>${esc(r.nickname)}</b> — ${EMOTIONS[r.emotion].wx} ${esc(r.word)} (${INTENSITY[r.after]})${r.cause ? ` · "${esc(r.cause)}"` : r.reasonText ? ` · "${esc(r.reasonText)}"` : ""}${r.need ? ` · 바람: ${esc(r.need)}` : ""}</li>`).join("")}</ul>`
                       : `<p class="muted">루틴 뒤에도 무거운 마음(크기 4 이상)이 남은 친구가 없어요.</p>`}
          <div class="tip">부정적인 감정 + 루틴 후 크기 4 이상인 학생이 표시돼요. 진단이 아닌 <b>대화의 시작점</b>으로 활용하세요.
            학생이 적은 <b>바람</b>을 먼저 알아주면 대화가 쉬워져요.</div></div>
      </div>
      <div class="grid2">
        <div><h3>📝 오늘의 마음 문장 표현 단계</h3><div class="bars">${[1, 2, 3, 4].map(i => `
          <div class="bar-line" style="grid-template-columns:150px 1fr 34px"><span>${LEVELS[i].ico} ${i}단계 ${["감정 낱말", "+상황", "+원인", "+바람"][i - 1]}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${lvCount[i] / Math.max(1, ...lvCount) * 100}%;background:var(--accent)"></div></div>
            <span>${lvCount[i]}</span></div>`).join("")}</div>
          <div class="tip">단순한 감정 낱말에서 <b>상황·원인·바람을 함께 설명하는 맥락적 서술</b>로 얼마나 넓어졌는지 보여 줘요.</div></div>
        <div><h3>🌱 학생별 표현 단계 변화 (전체 기간)</h3>
          ${growth.length ? `<div class="tbl-wrap"><table><tr><th>학생</th><th>처음 → 최근</th><th>기록</th></tr>
            ${growth.slice(0, 12).map(g => `<tr><td>${esc(g.n)}</td><td>${g.from.toFixed(1)} → <b style="color:${g.to > g.from ? "var(--calm)" : "inherit"}">${g.to.toFixed(1)}</b>${g.to > g.from ? " ↑" : ""}</td><td>${g.cnt}회</td></tr>`).join("")}</table></div>`
            : `<p class="muted">학생별로 기록이 2번 이상 쌓이면 변화가 보여요.</p>`}</div>
      </div>
      <h3 style="margin-top:22px">학생별 기록</h3>
      <div class="tbl-wrap"><table>
        <tr><th>학생</th><th>감정</th><th>크기 전→후</th><th>몸의 신호</th><th>마음 문장</th><th>단계</th><th>돌보기</th><th>돌아보기</th></tr>
        ${people.length ? people.map(r => `<tr><td><b>${esc(r.nickname)}</b></td>
          <td>${EMOTIONS[r.emotion]?.wx} ${esc(r.word)}</td><td>${r.intensity} → ${r.after}</td>
          <td>${esc((r.body || []).join(", "))}</td><td style="min-width:220px">${esc(r.narrative || r.reasonText || r.reason || "")}</td>
          <td>${r.level ? LEVELS[r.level].ico + " " + r.level : "—"}</td>
          <td>${esc(STRATEGIES[r.strategy]?.name || "")}</td><td>${esc(r.note)}</td></tr>`).join("")
          : `<tr><td colspan="8" class="muted">이 날짜의 기록이 없어요.</td></tr>`}
      </table></div>
      <p class="muted" style="font-size:13px">같은 날 여러 번 기록한 학생은 가장 최근 기록만 보여요. 전체 기록 ${all.length}건.</p>
    </div>`;
  $("#tRefresh").onclick = () => $("#tOpen").click();
}

/* ════════════════════════════════════════════
   9. 시작
   ════════════════════════════════════════════ */
initDB().then(renderStamps);
