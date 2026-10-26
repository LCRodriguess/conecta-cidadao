class AppFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
    <footer>
      <p>Conecta Cidadão</p>
    </footer>
    `;
    }
}

customElements.define('app-footer', AppFooter);