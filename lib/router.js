/**
 * Created by Guardeec on 11.07.17.
 */
Router.route('/', function () {
    this.render('dashboard');
});

Router.route('/nmap', function () {
    this.render('nmap');
});

Router.route('/settings', function () {
    this.render('settings');
});