    document.getElementById('gateway-form').onsubmit = (e) => {
      e.preventDefault();
      let query = document.getElementById('url-field').value.trim();
      
      const activeTab = document.querySelector('.tab.active .tab-title');
      if (activeTab) {
        activeTab.innerText = query.length > 10 ? query.substring(0, 10) + '...' : query;
      }

      // Automatically turns plain text into a Google search query
      if (!query.includes('.') || query.includes(' ')) {
        query = 'https://google.com' + encodeURIComponent(query);
      } else if (!/^https?:\/\//i.test(query)) {
        query = 'https://' + query;
      }
      
      // Encodes the URL into base64 to hide it from network scanners
      const encoded = btoa(query).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
      // Routes traffic through a public, high-speed Ultraviolet proxy node
      window.location.href = "https://tachyons.xyz" + encoded;
    };

