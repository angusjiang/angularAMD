define(['squire'], function (Squire) {

    Squire.prototype.testPresenceinSelection = function (name, action, format, validation) {
        var path = this.getPath(),
            test = (validation.test(path) | this.hasFormat(format));
        if (name == action && test) {
            return true;
        } else {
            return false;
        }
    };
    SquireUI = function (options) {

        var container, editor;
        if (options.replace) {
            container = $(options.replace).parent();
            $(options.replace).remove();
        } else if (options.div) {
            container = $(options.div);
        } else {
            throw new Error(
                "No element was defined for the editor to inject to.");
        }
        var iframe = document.createElement('iframe');
        var div = document.createElement('div');
        div.className = 'Squire-UI';
        iframe.height = options.height;

        $(div).load('public/directive/templates/Squire-UI.html', function () {
            
            $("#insertImage").CoreUpload({
                extensions: ['jpg', 'png', 'jpeg'],
                actionToSubmitUpload: "./index/image_upload",
                enableDrag: true,
                inputOfFile: 'file-image',
                uploadingFun: function() {
                    App.LoadingSpinner.show();
                },
                uploadedCallback: function (result) {
                    App.LoadingSpinner.hide();
                    if(result.errno==0){
                        var editor = iframe.contentWindow.editor;
                        editor.insertImage(result.data.src);   
                    }
                    
                }
            });
            
            $('.item').click(function () {
                var iframe = $(this).parents('.Squire-UI').next('iframe').first()[0];
                var editor = iframe.contentWindow.editor;
                var action = $(this).data('action');

                test = {
                    value: $(this).data('action'),
                    testBold: editor.testPresenceinSelection('bold',
                        action, 'B', (/>B\b/)),
                    testItalic: editor.testPresenceinSelection('italic',
                        action, 'I', (/>I\b/)),
                    testUnderline: editor.testPresenceinSelection(
                        'underline', action, 'U', (/>U\b/)),
                    testOrderedList: editor.testPresenceinSelection(
                        'makeOrderedList', action, 'OL', (/>OL\b/)),
                    testLink: editor.testPresenceinSelection('makeLink',
                        action, 'A', (/>A\b/)),
                    testQuote: editor.testPresenceinSelection(
                        'increaseQuoteLevel', action, 'blockquote', (
                            />blockquote\b/)),
                    isNotValue: function (a) {
                        return (a == action && this.value !== '');
                    }
                };
                
                

                editor.alignRight = function () {
                    editor.setTextAlignment('right');
                };
                editor.alignCenter = function () {
                    editor.setTextAlignment('center');
                };
                editor.alignLeft = function () {
                    editor.setTextAlignment('left');
                };
                editor.alignJustify = function () {
                    editor.setTextAlignment('justify');
                };
                editor.makeHeading = function () {
                    editor.setFontSize('2em');
                    editor.bold();
                };

                if (test.testBold | test.testItalic | test.testUnderline | test.testOrderedList | test.testLink | test.testQuote) {
                    if (test.testBold) editor.removeBold();
                    if (test.testItalic) editor.removeItalic();
                    if (test.testUnderline) editor.removeUnderline();
                    if (test.testLink) editor.removeLink();
                    if (test.testOrderedList) editor.removeList();
                    if (test.testQuote) editor.decreaseQuoteLevel();
                } else if (test.isNotValue('makeLink') | test.isNotValue('insertImage') | test.isNotValue('selectFont')) {
                    // do nothing these are dropdowns.
                } else {
                    editor[action]();
                    editor.focus();
                }
            });
        });

        iframe.addEventListener('load', function () {
            // Make sure we're in standards mode.
            var doc = iframe.contentDocument;
            if (doc.compatMode !== 'CSS1Compat') {
                doc.open();
                doc.write('<!DOCTYPE html><title></title>');
                doc.close();
            }
            // doc.close() can cause a re-entrant load event in some browsers,
            // such as IE9.
            if (iframe.contentWindow.editor) {
                return;
            }
            iframe.contentWindow.editor = new Squire(iframe.contentWindow.document);
            iframe.contentWindow.editor.addStyles(
                'html {' +
                '  height: 100%;' +
                '}' +
                'body {' +
                '  -moz-box-sizing: border-box;' +
                '  -webkit-box-sizing: border-box;' +
                '  box-sizing: border-box;' +
                '  height: 100%;' +
                '  padding: 5px 10px;' +
                '  background: transparent;' +
                '  color: #2b2b2b;' +
                '  font: 14px/1.35 Helvetica, arial, sans-serif;' +
                '  cursor: text;' +
                '}' +
                'a {' +
                '  text-decoration: underline;' +
                '}' +
                'h1 {' +
                '  font-size: 138.5%;' +
                '}' +
                'h2 {' +
                '  font-size: 123.1%;' +
                '}' +
                'h3 {' +
                '  font-size: 108%;' +
                '}' +
                'h1,h2,h3,p {' +
                '  margin: 1em 0;' +
                '}' +
                'h4,h5,h6 {' +
                '  margin: 0;' +
                '}' +
                'ul, ol {' +
                '  margin: 0 1em;' +
                '  padding: 0 1em;' +
                '}' +
                'blockquote {' +
                '  border-left: 2px solid blue;' +
                '  margin: 0;' +
                '  padding: 0 10px;' +
                '}' +
                'img {' +
                '   max-width:100%;' +
                '}'
                
            );
        });

        $(container).append(div);
        $(container).append(iframe);

        return iframe.contentWindow.editor;
    };
});