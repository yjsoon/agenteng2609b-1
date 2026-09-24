/* Product Thinking course — reusable quiz + practice components.

   Quiz markup:
     <div class="quiz">
       <div class="q" data-answer="0">            <- index of the correct option
         <p class="q-prompt">Question…</p>
         <div class="q-options"><button>A</button><button>B</button></div>
         <p class="q-feedback" data-right="Why it's right" data-wrong="Why the other one is wrong"></p>
       </div>
     </div>
   Adds a running score line under each .quiz.

   Practice markup (free text, saved locally per viewer):
     <div class="practice" data-key="unique-key">
       <textarea></textarea>
       <ul class="checklist"><li><label><input type="checkbox"> Criterion</label></li></ul>
     </div>
*/
(function () {
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var qs = quiz.querySelectorAll(".q");
    var answered = 0, right = 0;
    var score = document.createElement("p");
    score.className = "quiz-score";
    score.textContent = "0 of " + qs.length + " answered";
    quiz.appendChild(score);

    qs.forEach(function (q, qi) {
      var num = q.querySelector(".q-prompt");
      if (num && qs.length > 1) {
        var n = document.createElement("span");
        n.className = "q-num"; n.textContent = (qi + 1) + "/" + qs.length;
        num.prepend(n);
      }
      var answer = parseInt(q.dataset.answer, 10);
      var buttons = q.querySelectorAll(".q-options button");
      var fb = q.querySelector(".q-feedback");
      buttons.forEach(function (b, i) {
        b.type = "button";
        b.addEventListener("click", function () {
          var ok = i === answer;
          buttons.forEach(function (x, j) {
            x.disabled = true;
            if (j === answer) x.classList.add("correct");
            else if (j === i) x.classList.add("wrong");
          });
          if (fb) {
            fb.innerHTML = '<span class="verdict">' + (ok ? "Correct" : "Not quite") + "</span>" +
              (ok ? fb.dataset.right : (fb.dataset.wrong || fb.dataset.right));
            fb.classList.add("show", ok ? "is-right" : "is-wrong");
          }
          answered++; if (ok) right++;
          score.textContent = answered < qs.length
            ? answered + " of " + qs.length + " answered"
            : "Score: " + right + " / " + qs.length;
        });
      });
    });
  });

  document.querySelectorAll(".practice").forEach(function (p) {
    var key = "pt:" + (p.dataset.key || location.pathname);
    var ta = p.querySelector("textarea");
    if (ta) {
      var saved = store(key);
      if (saved) ta.value = saved;
      ta.addEventListener("input", function () { store(key, ta.value); });
    }
  });
})();
