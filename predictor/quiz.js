(() => {
  "use strict";

  // Quiz data stays local to this static page and is never uploaded or persisted.
  const QUIZ_CONFIG = {
    ringQuestionId: "rings",
    ringPosition: 5,
    questions: [
      {
        id: "bags",
        image: "images/bags.png",
        text: "Which bag would you love to carry?",
        alt: "Four bags arranged in a two by two collage",
      },
      {
        id: "bottle",
        image: "images/bottle.jpg",
        text: "Which bottle would be your everyday companion?",
        alt: "Four bottles arranged in a two by two collage",
      },
      {
        id: "car",
        image: "images/car.png",
        text: "Which car would you pick for your dream drive?",
        alt: "Four cars arranged in a two by two collage",
      },
      {
        id: "earrings",
        image: "images/earrings.png",
        text: "Which earrings catch your eye?",
        alt: "Four pairs of earrings arranged in a two by two collage",
      },
      {
        id: "heels",
        image: "images/heels.png",
        text: "Which heels would you choose?",
        alt: "Four pairs of heels arranged in a two by two collage",
      },
      {
        id: "house",
        image: "images/house.png",
        text: "Which house feels like your dream home?",
        alt: "Four houses arranged in a two by two collage",
      },
      {
        id: "mirror",
        image: "images/mirror.png",
        text: "Which mirror would suit your dressing table?",
        alt: "Four mirrors arranged in a two by two collage",
      },
      {
        id: "mobilecover",
        image: "images/mobilecover.png",
        text: "Which phone case would you pick?",
        alt: "Four phone cases arranged in a two by two collage",
      },
      {
        id: "nails",
        image: "images/nails.png",
        text: "Which nails would you love to try?",
        alt: "Four nail styles arranged in a two by two collage",
      },
      {
        id: "necklace",
        image: "images/necklace.png",
        text: "Which necklace matches your style?",
        alt: "Four necklaces arranged in a two by two collage",
      },
      {
        id: "perfume",
        image: "images/perfume.png",
        text: "Which perfume bottle catches your eye?",
        alt: "Four perfume bottles arranged in a two by two collage",
      },
      {
        id: "rings",
        image: "images/rings.png",
        text: "Which ring matches your style?",
        alt: "Four rings arranged in a two by two collage",
      },
      {
        id: "sport",
        image: "images/sport.jpg",
        text: "Which sporty look would you choose?",
        alt: "Four sporty looks arranged in a two by two collage",
      },
    ],
    results: {
      1: "You have a soft heart, a love for baby pink, and a smile that belongs on camera. Behind that sweet side is an ambitious girl with dreams of building her own empire. 💗",
      2: "You’re a girl with a kind heart and big dreams. You love a little baby pink, enjoy your moment in front of the camera, and have the determination to create something of your own. ✨",
      3: "Your heart is gentle, your style has a touch of baby pink, and you come alive in front of the camera. You dream beautifully, but you also have the ambition to turn those dreams into your own empire. 🌷",
      4: "You have a sweet heart, a playful love for the camera, and a soft spot for baby pink. What makes you even more special is your drive to grow, achieve big things, and build a future you’re proud of. 💕",
    },
  };

  const elements = {
    welcome: document.querySelector("#sq-welcome"),
    quiz: document.querySelector("#sq-quiz"),
    preparing: document.querySelector("#sq-preparing"),
    result: document.querySelector("#sq-result"),
    start: document.querySelector("#sq-start"),
    initState: document.querySelector("#sq-init-state"),
    initCopy: document.querySelector("#sq-init-copy"),
    readyStatus: document.querySelector("#sq-ready-status"),
    connectivity: document.querySelector("#sq-connectivity"),
    questionTop: document.querySelector("#sq-question-top"),
    questionCard: document.querySelector("#sq-question-card"),
    questionCount: document.querySelector("#sq-question-count"),
    questionTitle: document.querySelector("#sq-question-title"),
    answeredCount: document.querySelector("#sq-answered-count"),
    progress: document.querySelector("#sq-progress"),
    progressFill: document.querySelector("#sq-progress-fill"),
    progressValue: document.querySelector("#sq-progress-value"),
    viewingCue: document.querySelector("#sq-viewing-cue"),
    viewingCueText: document.querySelector("#sq-viewing-cue-text"),
    countdown: document.querySelector("#sq-countdown"),
    imageStage: document.querySelector("#sq-image-stage"),
    image: document.querySelector("#sq-collage"),
    imageError: document.querySelector("#sq-image-error"),
    retryImage: document.querySelector("#sq-retry-image"),
    options: document.querySelector("#sq-options"),
    optionInputs: Array.from(document.querySelectorAll('input[name="sq-answer"]')),
    status: document.querySelector("#sq-status"),
    back: document.querySelector("#sq-back"),
    next: document.querySelector("#sq-next"),
    resultTitle: document.querySelector("#sq-result-title"),
    resultMessage: document.querySelector("#sq-result-message"),
    playAgain: document.querySelector("#sq-play-again"),
  };

  const state = {
    questionOrder: [],
    selections: new Map(),
    currentIndex: 0,
    imageReady: false,
    questionReady: false,
    countdownRemaining: 3,
    transitioning: false,
    imageAttempt: 0,
    initTimer: null,
    cueTimer: null,
    navigationTimer: null,
    resultTimer: null,
    focusTimer: null,
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function shuffle(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
  }

  function createQuestionOrder() {
    const ringQuestion = QUIZ_CONFIG.questions.find(
      (question) => question.id === QUIZ_CONFIG.ringQuestionId,
    );
    const otherQuestions = shuffle(
      QUIZ_CONFIG.questions.filter((question) => question.id !== QUIZ_CONFIG.ringQuestionId),
    );

    if (!ringQuestion) {
      throw new Error("The configured ring question could not be found.");
    }

    return [
      ...otherQuestions.slice(0, QUIZ_CONFIG.ringPosition),
      ringQuestion,
      ...otherQuestions.slice(QUIZ_CONFIG.ringPosition),
    ];
  }

  function clearTimer(timerName) {
    if (state[timerName] !== null) {
      window.clearTimeout(state[timerName]);
      state[timerName] = null;
    }
  }

  function clearAttemptTimers() {
    clearTimer("cueTimer");
    clearTimer("navigationTimer");
    clearTimer("resultTimer");
    clearTimer("focusTimer");
  }

  function showScreen(screen) {
    elements.welcome.hidden = screen !== "welcome";
    elements.quiz.hidden = screen !== "quiz";
    elements.preparing.hidden = screen !== "preparing";
    elements.result.hidden = screen !== "result";
  }

  function setStatus(message = "") {
    elements.status.textContent = message;
  }

  function updateConnectivity() {
    const online = navigator.onLine;
    elements.connectivity.textContent = online ? "Online" : "Offline";
    elements.connectivity.classList.toggle("sq-is-offline", !online);
  }

  function runInitializationDemo() {
    clearTimer("initTimer");
    elements.initState.classList.add("sq-is-loading");
    elements.initState.classList.remove("sq-is-success");
    elements.initCopy.textContent = "Simulating OpenAI API connection…";
    elements.readyStatus.textContent = "Initializing";

    state.initTimer = window.setTimeout(() => {
      elements.initState.classList.remove("sq-is-loading");
      elements.initState.classList.add("sq-is-success");
      elements.initCopy.textContent = "Demo connection successful";
      elements.readyStatus.textContent = "Quiz ready";
      state.initTimer = null;
    }, reducedMotion.matches ? 0 : 1000);
  }

  function updateCompletion() {
    const total = QUIZ_CONFIG.questions.length;
    const answered = state.selections.size;
    const completionPercent = Math.round((answered / total) * 100);

    elements.answeredCount.textContent = `${answered} of ${total} answered`;
    elements.progressValue.textContent = `${completionPercent}%`;
    elements.progress.setAttribute("aria-valuemax", String(total));
    elements.progress.setAttribute("aria-valuenow", String(answered));
    elements.progressFill.style.width = `${completionPercent}%`;
  }

  function loadQuestionImage(question, retry = false) {
    state.imageReady = false;
    elements.imageStage.classList.remove("sq-is-ready", "sq-has-error");
    elements.imageError.hidden = true;
    elements.options.disabled = true;
    elements.image.alt = question.alt;
    elements.image.src = retry ? `${question.image}?retry=${state.imageAttempt}` : question.image;

    if (elements.image.complete && elements.image.naturalWidth > 0) {
      handleImageLoad();
    }
  }

  function handleImageLoad() {
    state.imageReady = true;
    elements.imageStage.classList.add("sq-is-ready");
    elements.imageStage.classList.remove("sq-has-error");
    elements.imageError.hidden = true;
    elements.options.disabled = false;
    syncNextButton();
  }

  function handleImageError() {
    state.imageReady = false;
    elements.imageStage.classList.remove("sq-is-ready");
    elements.imageStage.classList.add("sq-has-error");
    elements.imageError.hidden = false;
    elements.options.disabled = true;
    syncNextButton();
  }

  function syncNextButton() {
    const question = state.questionOrder[state.currentIndex];
    const hasSelection = question && state.selections.has(question.id);
    elements.next.disabled = !hasSelection || !state.questionReady || state.transitioning;
  }

  function restoreSelection(question) {
    const selectedValue = state.selections.get(question.id);

    elements.optionInputs.forEach((input) => {
      input.checked = Number(input.value) === selectedValue;
    });
  }

  function startQuestionCountdown(question) {
    clearTimer("cueTimer");
    state.questionReady = false;
    state.countdownRemaining = 3;
    elements.viewingCue.classList.remove("sq-is-ready");
    elements.countdown.textContent = "3";
    elements.viewingCueText.textContent = "Next unlocks in 3 seconds";
    syncNextButton();

    const advanceCountdown = () => {
      const currentQuestion = state.questionOrder[state.currentIndex];

      if (elements.quiz.hidden || !currentQuestion || currentQuestion.id !== question.id) {
        state.cueTimer = null;
        return;
      }

      state.countdownRemaining -= 1;

      if (state.countdownRemaining > 0) {
        elements.countdown.textContent = String(state.countdownRemaining);
        elements.viewingCueText.textContent = `Next unlocks in ${state.countdownRemaining} seconds`;
        state.cueTimer = window.setTimeout(advanceCountdown, 1000);
        return;
      }

      state.questionReady = true;
      elements.countdown.textContent = "✓";
      elements.viewingCue.classList.add("sq-is-ready");
      elements.viewingCueText.textContent = "You can continue when ready";
      state.cueTimer = null;
      syncNextButton();
    };

    state.cueTimer = window.setTimeout(advanceCountdown, 1000);
  }

  function renderQuestion({ focus = true } = {}) {
    const question = state.questionOrder[state.currentIndex];
    const questionNumber = state.currentIndex + 1;
    const total = state.questionOrder.length;

    elements.questionCount.textContent = `Question ${questionNumber} of ${total}`;
    elements.questionTitle.textContent = question.text;
    elements.back.hidden = state.currentIndex === 0;
    elements.back.disabled = state.currentIndex === 0;
    elements.next.textContent = state.currentIndex === total - 1 ? "View my result" : "Next";
    setStatus();
    updateCompletion();
    restoreSelection(question);
    startQuestionCountdown(question);
    loadQuestionImage(question);
    syncNextButton();

    elements.questionCard.classList.remove("sq-is-leaving");
    void elements.questionCard.offsetWidth;

    if (focus) {
      elements.questionTop.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
      clearTimer("focusTimer");
      state.focusTimer = window.setTimeout(() => {
        elements.questionTitle.focus({ preventScroll: true });
        state.focusTimer = null;
      }, reducedMotion.matches ? 0 : 160);
    }
  }

  function resetAttempt() {
    clearAttemptTimers();
    state.questionOrder = createQuestionOrder();
    state.selections.clear();
    state.currentIndex = 0;
    state.imageReady = false;
    state.questionReady = false;
    state.countdownRemaining = 3;
    state.imageAttempt = 0;
    state.transitioning = false;
    elements.optionInputs.forEach((input) => {
      input.checked = false;
    });
    updateCompletion();
    setStatus();
  }

  function startQuiz() {
    if (state.transitioning) {
      return;
    }

    showScreen("quiz");
    renderQuestion();
  }

  function moveToQuestion(nextIndex) {
    if (state.transitioning || nextIndex < 0 || nextIndex >= state.questionOrder.length) {
      return;
    }

    clearTimer("cueTimer");
    clearTimer("focusTimer");
    state.transitioning = true;
    elements.next.disabled = true;
    elements.back.disabled = true;
    elements.questionCard.classList.add("sq-is-leaving");

    state.navigationTimer = window.setTimeout(
      () => {
        state.currentIndex = nextIndex;
        state.transitioning = false;
        state.navigationTimer = null;
        renderQuestion();
      },
      reducedMotion.matches ? 0 : 135,
    );
  }

  function showResult() {
    const ringSelection = state.selections.get(QUIZ_CONFIG.ringQuestionId);
    const resultMessage = QUIZ_CONFIG.results[ringSelection];

    if (!resultMessage) {
      state.transitioning = false;
      showScreen("quiz");
      setStatus("Please answer every question before viewing your result.");
      syncNextButton();
      return;
    }

    elements.resultMessage.textContent = resultMessage;
    showScreen("result");
    state.transitioning = false;
    state.resultTimer = null;
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    clearTimer("focusTimer");
    state.focusTimer = window.setTimeout(() => {
      elements.resultTitle.focus({ preventScroll: true });
      state.focusTimer = null;
    }, reducedMotion.matches ? 0 : 160);
  }

  function prepareResult() {
    const firstUnansweredIndex = state.questionOrder.findIndex(
      (question) => !state.selections.has(question.id),
    );

    if (firstUnansweredIndex !== -1) {
      setStatus("Please answer every question before viewing your result.");
      moveToQuestion(firstUnansweredIndex);
      return;
    }

    clearAttemptTimers();
    state.transitioning = true;
    showScreen("preparing");
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    state.resultTimer = window.setTimeout(showResult, reducedMotion.matches ? 0 : 1000);
  }

  function handleNext() {
    if (state.transitioning || elements.next.disabled) {
      return;
    }

    if (state.currentIndex === state.questionOrder.length - 1) {
      elements.next.disabled = true;
      prepareResult();
      return;
    }

    moveToQuestion(state.currentIndex + 1);
  }

  function restartQuiz() {
    resetAttempt();
    showScreen("welcome");
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
    elements.start.focus({ preventScroll: true });
  }

  function cleanup() {
    clearTimer("initTimer");
    clearAttemptTimers();
    window.removeEventListener("online", updateConnectivity);
    window.removeEventListener("offline", updateConnectivity);
  }

  elements.start.addEventListener("click", startQuiz);
  elements.playAgain.addEventListener("click", restartQuiz);
  elements.next.addEventListener("click", handleNext);
  elements.back.addEventListener("click", () => moveToQuestion(state.currentIndex - 1));
  elements.image.addEventListener("load", handleImageLoad);
  elements.image.addEventListener("error", handleImageError);
  elements.retryImage.addEventListener("click", () => {
    state.imageAttempt += 1;
    loadQuestionImage(state.questionOrder[state.currentIndex], true);
  });

  elements.optionInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!state.imageReady || state.transitioning) {
        return;
      }

      const question = state.questionOrder[state.currentIndex];
      state.selections.set(question.id, Number(input.value));
      setStatus();
      updateCompletion();
      syncNextButton();
    });
  });

  window.addEventListener("online", updateConnectivity);
  window.addEventListener("offline", updateConnectivity);
  window.addEventListener("pagehide", cleanup, { once: true });

  resetAttempt();
  updateConnectivity();
  runInitializationDemo();
})();
