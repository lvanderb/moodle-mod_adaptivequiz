// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * JavaScript library for the adaptivequiz module.
 *
 * @package    mod_adaptivequiz
 * @copyright  2013 onwards Remote-Learner {@link http://www.remote-learner.ca/}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.mod_adaptivequiz = M.mod_adaptivequiz || {};

M.mod_adaptivequiz.init_attempt_form = function(Y) {
    M.core_question_engine.init_form(Y, '#responseform');
    M.core_formchangechecker.init({formid: 'responseform'});
};

M.mod_adaptivequiz.secure_window = {
    init: function(Y) {
        if (window.location.href.substring(0, 4) == 'file') {
            window.location = 'about:blank';
        }
        Y.delegate('contextmenu', M.mod_adaptivequiz.secure_window.prevent, document, '*');
        Y.delegate('mousedown',   M.mod_adaptivequiz.secure_window.prevent_mouse, document, '*');
        Y.delegate('mouseup',     M.mod_adaptivequiz.secure_window.prevent_mouse, document, '*');
        Y.delegate('dragstart',   M.mod_adaptivequiz.secure_window.prevent, document, '*');
        Y.delegate('selectstart', M.mod_adaptivequiz.secure_window.prevent, document, '*');
        Y.delegate('cut',         M.mod_adaptivequiz.secure_window.prevent, document, '*');
        Y.delegate('copy',        M.mod_adaptivequiz.secure_window.prevent, document, '*');
        Y.delegate('paste',       M.mod_adaptivequiz.secure_window.prevent, document, '*');
        M.mod_adaptivequiz.secure_window.clear_status;
        Y.on('beforeprint', function() {
            Y.one(document.body).setStyle('display', 'none');
        }, window);
        Y.on('afterprint', function() {
            Y.one(document.body).setStyle('display', 'block');
        }, window);
        Y.on('key', M.mod_adaptivequiz.secure_window.prevent, '*', 'press:67,86,88+ctrl');
        Y.on('key', M.mod_adaptivequiz.secure_window.prevent, '*', 'up:67,86,88+ctrl');
        Y.on('key', M.mod_adaptivequiz.secure_window.prevent, '*', 'down:67,86,88+ctrl');
        Y.on('key', M.mod_adaptivequiz.secure_window.prevent, '*', 'press:67,86,88+meta');
        Y.on('key', M.mod_adaptivequiz.secure_window.prevent, '*', 'up:67,86,88+meta');
        Y.on('key', M.mod_adaptivequiz.secure_window.prevent, '*', 'down:67,86,88+meta');
    },

    clear_status: function() {
        window.status = '';
        setTimeout(M.mod_adaptivequiz.secure_window.clear_status, 10);
    },

    prevent: function(e) {
        alert(M.str.adaptivequiz.functiondisabledbysecuremode);
        e.halt();
    },

    prevent_mouse: function(e) {
        if (e.button == 1 && /^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL|A)$/i.test(e.target.get('tagName'))) {
            // Left click on a button or similar. No worries.
            return;
        }
        e.halt();
    },

    /**
     * Event handler for the adaptivequiz start attempt button.
     */
    start_attempt_action: function(e, args) {
        if (args.startattemptwarning == '') {
            openpopup(e, args);
        } else {
            M.util.show_confirm_dialog(e, {
                message: args.startattemptwarning,
                callback: function() {
                    openpopup(e, args);
                },
                continuelabel: M.util.get_string('startattempt', 'quiz')
            });
        }
    },

    init_close_button: function(Y, url) {
        Y.on('click', function(e) {
            M.mod_adaptivequiz.secure_window.close(url, 0)
        }, '#secureclosebutton');
    },

    close: function(Y, url, delay) {
        setTimeout(function() {
            if (window.opener) {
                window.opener.document.location.reload();
                window.close();
            } else {
                window.location.href = url;
            }
        }, delay*1000);
    }
};

M.mod_adaptivequiz.init_comment_popup = function(Y) {
    // Add a close button to the window.
    var closebutton = Y.Node.create('<input type="button" />');
    closebutton.set('value', M.util.get_string('cancel', 'moodle'));
    Y.one('#id_submitbutton').ancestor().append(closebutton);
    Y.on('click', function() { window.close() }, closebutton);
}