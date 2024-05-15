document.addEventListener('DOMContentLoaded', function() {
    const user = netlifyIdentity.currentUser();
    const container = document.getElementById('updateStatusButtonContainer');
  
      const formContainer = document.getElementById('formContainer');
      const form = document.createElement('form');
      form.id = 'statusForm';

      const select = document.createElement('select');
      select.id = 'statusSelect';

      const statusTranslations = {
        "new": translations.new,
        "in_progress": translations.in_progress,
        "completed": translations.completed,
        "tested_not_ok": translations.tested_not_ok,
        "tested_ok": translations.tested_ok,
        "rejected": translations.rejected
      };
      Object.entries(statusTranslations).forEach(([value, text]) => {
        const option = document.createElement('option');
        option.value = value;
        option.text = text || statusTranslations.new; // Display 'Blank' for the empty string option
        select.appendChild(option);
      });
      select.value = hugoParams.status || "new"; // Set the current status as the default value

      const saveButton = document.createElement('button');
      saveButton.type = user ? "submit" : "button";
      saveButton.textContent = user ? 'Update status' : 'Log in to update status';
      if (!user) {
        select.disabled = true;
        saveButton.onclick = function() {
          netlifyIdentity?.open();
        };
        const statusParagraph = document.createElement('span');
        statusParagraph.textContent = hugoParams.status || statusTranslations.new;
        form.appendChild(statusParagraph);
      }
      if (user) {
        form.appendChild(select);
      }
      form.appendChild(saveButton);


      formContainer.appendChild(form);

      const statusParagraph = document.createElement('p');
      statusParagraph.role = 'status';
      statusParagraph.classList.add('status-message');

      const url = window.location.href;
      let repoName;
      if (url.includes('reports.useit.se')) {
        repoName = url.split('/')[3]; // Assuming the repo name is the fourth segment in the URL
      } else if (url.includes('.netlify.app')) {
        repoName = url.split('//')[1].split('.')[0]; // Assuming the repo name is the first segment before '.netlify.app'
      }

      form.onsubmit = async function(event) {
        event.preventDefault();
        
        

        const status = select.value;
        const pageId = window.location.pathname.slice(0, -1) + '.md';
        const cleanedPageId = window.location.pathname.includes('/problems') 
                              ? window.location.pathname.slice(window.location.pathname.indexOf('/problems')) 
                              : pageId;
        console.log('Saving status...', status, pageId);
        saveButton.disabled = true;
        select.disabled = true;

      try {
        const response = await fetch(hugoParams.absURL + '.netlify/functions/update-status', {
          method: 'POST',
          body: JSON.stringify({ pageId: cleanedPageId, status, language: hugoParams.siteLanguage, repo: repoName }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) { // Check if the response status is 200 (OK)
          // append container with  paragraph
          statusParagraph.innerHTML = 'Rebuilding page, may take 60 seconds... <div class="spinner"></div>'
          container.appendChild(statusParagraph);
          setTimeout(() => {
            window.location.reload();
          }, 60000);
        } else {
          throw new Error('Failed to update status');
        }
      } catch (error) {
        // append container with error paragraph
        statusParagraph.innerHTML = 'Update Failed - Retry?';
        container.appendChild(statusParagraph);
        console.error('Error updating the page:', error);
        saveButton.innerText = 'Update status';
        saveButton.disabled = false;
        select.disabled = false;
      }
      };
  });