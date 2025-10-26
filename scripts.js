
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    console.error("Elemento 'toast-container' não encontrado no DOM.");
    alert(`${type === 'success' ? 'Sucesso' : 'Erro'}: ${message}`);
    return;
  }

  const toastId = 'toast-' + Math.random().toString(36).substr(2, 9);
  const toastColorClass = type === 'success' ? 'bg-success' : 'bg-danger';

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${toastColorClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  
  const toastElement = document.getElementById(toastId);

  if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
      

      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
      });
      
      toast.show();
  } else {
      console.error("Bootstrap Toast não está disponível.");
      toastElement.remove(); 
      alert(`${type === 'success' ? 'Sucesso' : 'Erro'}: ${message}`);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const loggedOutView = document.getElementById('auth-logged-out');
  const loggedInView = document.getElementById('auth-logged-in');
  const signInButton = document.getElementById('signin-button');
  const signOutButton = document.getElementById('signout-button');
  const userNameSpan = loggedInView ? loggedInView.querySelector('.fw-medium') : null; 

  const loggedInUserString = localStorage.getItem('loggedInUser');
  let loggedInUser = null;

  if (loggedInUserString) {
    try {
      loggedInUser = JSON.parse(loggedInUserString);
    } catch (e) {
      console.error("Erro ao ler dados do usuário do localStorage", e);
      localStorage.removeItem('loggedInUser');
    }
  }


  const updateAuthUI = () => {
    const currentUserString = localStorage.getItem('loggedInUser');
    let currentUser = null;
    if (currentUserString) {
        try { currentUser = JSON.parse(currentUserString); } catch (e) { console.error(e); }
    }

    if (currentUser && loggedOutView && loggedInView && userNameSpan) {

      loggedOutView.classList.add('d-none');
      loggedInView.classList.remove('d-none');
      userNameSpan.textContent = currentUser.name || 'Usuário'; 
    } else if (loggedOutView && loggedInView) {

      loggedOutView.classList.remove('d-none');
      loggedInView.classList.add('d-none');
    }
  };


  if (signInButton) {
    signInButton.addEventListener('click', () => {

      window.location.href = 'login.html';
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser'); 
      showToast('Você saiu com sucesso.', 'success');
      updateAuthUI(); 


    });
  }


  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop() || 'index.html';
    

    link.classList.remove('active');
    link.removeAttribute('aria-current');
    link.style.borderBottom = ''; 
    link.style.paddingBottom = '';

    if (currentPath === linkPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
   
      link.style.borderBottom = '2px solid var(--brand-orange)';
      link.style.paddingBottom = '2px'; 
    }
  });
  
  
  updateAuthUI(); 
  if (typeof lucide !== 'undefined') {
    lucide.createIcons(); 
  } else {
    console.warn("Lucide icons não carregado.");
  }
});