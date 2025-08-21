(function($){
  // Search
  var $searchWrap = $('#search-form-wrap'),
    isSearchAnim = false,
    searchAnimDuration = 200;

  var startSearchAnim = function(){
    isSearchAnim = true;
  };

  var stopSearchAnim = function(callback){
    setTimeout(function(){
      isSearchAnim = false;
      callback && callback();
    }, searchAnimDuration);
  };

  $('#nav-search-btn').on('click', function(){
    if (isSearchAnim) return;

    startSearchAnim();
    $searchWrap.addClass('on');
    stopSearchAnim(function(){
      $('.search-form-input').focus();
    });
  });

  $('.search-form-input').on('blur', function(){
    startSearchAnim();
    $searchWrap.removeClass('on');
    stopSearchAnim();
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      title = $this.attr('data-title'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
            '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodedUrl + '" class="article-share-linkedin" target="_blank" title="LinkedIn"></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });
  // Code Block Copy - V2 with logging
  console.log("Vivia theme script: Initializing code block copy feature...");
  $('.article-entry .highlight').each(function(index) {
    var $highlight = $(this);
    console.log("Vivia theme script: Found highlight block #" + index, this);

    // Determine language for the data-lang attribute
    var lang = 'code';
    var classes = $highlight.attr('class').split(' ');
    for (var i = 0; i < classes.length; i++) {
      if (classes[i] !== 'highlight' && classes[i] !== 'article-entry') {
        lang = classes[i];
        break;
      }
    }
    $highlight.attr('data-lang', lang);
    console.log("Vivia theme script: Set lang to '" + lang + "' for block #" + index);

    // Create and append the copy button
    var $btn = $('<button class="copy-btn" title="Copy to clipboard">Copy</button>');
    $highlight.append($btn);

    $btn.on('click', function() {
      var codeElement = $highlight.find('pre code, .code pre').get(0);
      if (!codeElement) {
          console.error("Vivia theme script: Could not find code element to copy for block #" + index);
          return;
      }
      var codeToCopy = $(codeElement).text();

      // Use navigator.clipboard if available
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codeToCopy).then(function() {
          $btn.text('Copied!').addClass('copied');
          setTimeout(function() {
            $btn.text('Copy').removeClass('copied');
          }, 2000);
        }).catch(function(err) {
          console.error('Vivia theme script: Async copy failed', err);
          $btn.text('Error');
        });
      } else {
        // Fallback for insecure contexts
        var textArea = document.createElement("textarea");
        textArea.value = codeToCopy;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          $btn.text('Copied!').addClass('copied');
          setTimeout(function() {
            $btn.text('Copy').removeClass('copied');
          }, 2000);
        } catch (e) {
          console.error('Vivia theme script: Fallback copy failed', e);
          $btn.text('Error');
        }
        document.body.removeChild(textArea);
      }
    });
  });
})(jQuery);