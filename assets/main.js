const grey = '#333333'
const white = '#ffffff'
const font = '"Inter", sans-serif'
const neonGreen = '#C4F82A'

const sectionTemplate = document.createElement('template')
sectionTemplate.innerHTML = `
  <style>
    ::slotted([slot=title]) {
      margin-bottom: 0;
      color: red;
    }

    section {
      width: 100%;
      margin-bottom: 1em;
    }

    ul {
      padding: 0;
      margin: 0;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
    }
    
  </style>
  <section>
    
    <ul>
      <slot name="item"></slot>
    </ul>
    <slot></slot>
  </section>
`

class Section extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(sectionTemplate.content.cloneNode(true))
  }
}

customElements.define('profile-section', Section)

const linkListItemTemplate = document.createElement('template')
linkListItemTemplate.innerHTML = `
  <style>
    a, a:visited, a:link, a:active {
      display: block;
      background-color: ${grey};
      width: 100%;
      padding-block: 1.25rem;
      text-align: center;
      text-decoration: none;
      transition: background-color 0.3s;
      color: ${white};
      font-weight: 700;
      font-size: 14px;
      line-height: 1.5;
      border-radius: 0.5rem;
    }

    a:hover {
      color: ${grey};
      background-color: ${neonGreen};
    }

    li {
      list-style: none;
      width: 100%;
      display: block;
    }

  </style>
    <li><a><slot></slot></a></li>
`

class LinkListItem extends HTMLElement {
  static get observedAttributes() {
    return ['href', 'alt']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(linkListItemTemplate.content.cloneNode(true))
    shadow.querySelector('a').href = this.getAttribute('href')
    shadow.querySelector('a').alt = this.getAttribute('alt')
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'href':
        this.shadowRoot.querySelector('a').href = newValue
        break
      case 'alt':
        this.shadowRoot.querySelector('a').alt = newValue
        break
    }
  }
}

customElements.define('link-list-item', LinkListItem)

const profiles = document.createElement('div')

fetch('assets/profile.json')
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    data.forEach((profile) => {
      const profileSection = document.createElement('profile-section')
      profileSection.innerHTML = `<h2 slot="title">${profile.displayName}</h2>`

      const links = profile.links.map((link) => {
        return `<link-list-item slot="item" href="${link.url}" alt="${link.displayName}">${link.displayName}</link-list-item>`
      })

      profileSection.innerHTML += links.join('')
      profiles.appendChild(profileSection)
    })
  })
  .catch((error) => {
    console.error('Error:', error)
  })

const overview = document.getElementById('overview')
overview.appendChild(profiles)

document.getElementsByClassName('container')[0].classList.add('container--loaded')
