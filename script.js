// Scroll progress indicator
window.addEventListener("scroll", () => {
  const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

  let indicator = document.querySelector(".scroll-indicator")
  if (!indicator) {
    indicator = document.createElement("div")
    indicator.className = "scroll-indicator"
    document.body.appendChild(indicator)
  }

  indicator.style.transform = `scaleX(${scrollProgress / 100})`
})

// Parallax effect amélioré
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero")
  const heroCards = document.querySelectorAll(".hero-card")

  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`
  }

  heroCards.forEach((card, index) => {
    card.style.transform = `translateY(${scrolled * (0.1 + index * 0.05)}px) rotate(${scrolled * 0.01}deg)`
  })
})

// Animation des éléments au scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0) scale(1)"
      }, index * 100)
    }
  })
}, observerOptions)

// Initialiser les animations
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(".activity-card, .testimonial-card, .feature, .stat")

  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(50px) scale(0.9)"
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    animateOnScroll.observe(el)
  })
})

// Effet de particules pour le hero
function createParticles() {
  const hero = document.querySelector(".hero")
  const particlesContainer = document.createElement("div")
  particlesContainer.className = "particles"
  particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 212, 59, 0.6);
            border-radius: 50%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `
    particlesContainer.appendChild(particle)
  }

  hero.appendChild(particlesContainer)
}

// Fonction typeWriter améliorée pour gérer le HTML
function typeWriter(element, htmlText, speed = 50) {
  element.innerHTML = ""

  // Créer un élément temporaire pour parser le HTML
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlText

  // Extraire le texte pur tout en gardant la structure
  const textNodes = []
  const htmlStructure = []

  function extractTextAndStructure(node, currentPath = []) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      if (text.trim()) {
        textNodes.push({
          text: text,
          path: [...currentPath],
        })
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const newPath = [
        ...currentPath,
        {
          tagName: node.tagName,
          className: node.className,
          attributes: Array.from(node.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value
            return acc
          }, {}),
        },
      ]

      for (const child of node.childNodes) {
        extractTextAndStructure(child, newPath)
      }
    }
  }

  extractTextAndStructure(tempDiv)

  // Reconstruire le HTML progressivement
  let currentTextIndex = 0
  let currentCharIndex = 0

  function buildHTML() {
    let result = ""
    let currentNodeIndex = 0

    for (const nodeInfo of textNodes) {
      if (currentNodeIndex < currentTextIndex || (currentNodeIndex === currentTextIndex && currentCharIndex > 0)) {
        // Construire le chemin HTML pour ce nœud
        let openTags = ""
        let closeTags = ""

        for (const pathItem of nodeInfo.path) {
          openTags += `<${pathItem.tagName.toLowerCase()}`
          if (pathItem.className) {
            openTags += ` class="${pathItem.className}"`
          }
          for (const [attrName, attrValue] of Object.entries(pathItem.attributes)) {
            if (attrName !== "class") {
              openTags += ` ${attrName}="${attrValue}"`
            }
          }
          openTags += ">"
          closeTags = `</${pathItem.tagName.toLowerCase()}>` + closeTags
        }

        let textToShow = nodeInfo.text
        if (currentNodeIndex === currentTextIndex) {
          textToShow = nodeInfo.text.substring(0, currentCharIndex)
        }

        result += openTags + textToShow + closeTags
      }
      currentNodeIndex++
    }

    return result
  }

  function type() {
    if (currentTextIndex < textNodes.length) {
      const currentNode = textNodes[currentTextIndex]

      if (currentCharIndex < currentNode.text.length) {
        currentCharIndex++
        element.innerHTML = buildHTML()
        setTimeout(type, speed)
      } else {
        currentTextIndex++
        currentCharIndex = 0
        setTimeout(type, speed)
      }
    }
  }

  type()
}

// Version simplifiée qui préserve le HTML
function typeWriterSimple(element, htmlText, speed = 50) {
  // Sauvegarder le HTML original
  const originalHTML = htmlText
  element.innerHTML = ""

  // Créer un div temporaire pour extraire le texte pur
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlText
  const plainText = tempDiv.textContent || tempDiv.innerText

  let i = 0
  let currentHTML = ""

  function type() {
    if (i < plainText.length) {
      // Trouver la position actuelle dans le HTML original
      const currentText = plainText.substring(0, i + 1)

      // Reconstruire le HTML en gardant les balises
      if (originalHTML.includes('<span class="highlight">')) {
        const beforeSpan = originalHTML.indexOf('<span class="highlight">')
        const spanStart = originalHTML.indexOf(">", beforeSpan) + 1
        const spanEnd = originalHTML.indexOf("</span>", spanStart)
        const spanText = originalHTML.substring(spanStart, spanEnd)

        const textBeforeSpan = originalHTML.substring(0, beforeSpan).replace(/<[^>]*>/g, "")

        if (currentText.length <= textBeforeSpan.length) {
          currentHTML = currentText
        } else {
          const spanPortion = currentText.substring(textBeforeSpan.length)
          if (spanPortion.length <= spanText.length) {
            currentHTML = textBeforeSpan + '<span class="highlight">' + spanPortion + "</span>"
          } else {
            const afterSpanText = currentText.substring(textBeforeSpan.length + spanText.length)
            currentHTML = textBeforeSpan + '<span class="highlight">' + spanText + "</span>" + afterSpanText
          }
        }
      } else {
        currentHTML = currentText
      }

      element.innerHTML = currentHTML
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Initialisation corrigée
document.addEventListener("DOMContentLoaded", () => {
  createParticles()

  // Animation du titre avec effet de typing corrigé
  setTimeout(() => {
    const heroTitle = document.querySelector(".hero-title")
    if (heroTitle) {
      const originalText = heroTitle.innerHTML
      typeWriterSimple(heroTitle, originalText, 50)
    }
  }, 1000)

  // Observer pour les compteurs
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Placeholder for animateCounters function
        function animateCounters() {
          // Implement counter animation logic here
        }
        animateCounters()
        statsObserver.unobserve(entry.target)
      }
    })
  })

  const statsSection = document.querySelector(".stats")
  if (statsSection) {
    statsObserver.observe(statsSection)
  }
})

// Effet de hover sur les cartes
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".activity-card, .testimonial-card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-15px) rotateY(5deg) scale(1.03)"
      this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.2)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) rotateY(0) scale(1)"
      this.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
    })
  })
})


document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((lnk) => lnk.classList.remove("active"));
      this.classList.add("active");
    });
  });
});
