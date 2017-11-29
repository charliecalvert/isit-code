/**
 * Created by charlie on 3/1/16.
 */

describe('test elven-config suite', function() {
    'use strict';

    const lastname = 'calvert';
    const elfConfig = require('../index').elfConfig;
    const elfUtils = require('../index').elfUtils;
    const elfLog = require('../index').elfLog();
    elfLog.elfName = 'test-config';
    elfLog.setLevel(elfLog.logLevelDetails);

    beforeEach(function() {
        elfLog.nanoDetails('Before each called.');
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    });

    function errorHandler() {
        expect(false).toBe(true);
    }

    it('shows we can load the elf config async', function(done) {
        elfConfig.useLocalConfig = false;
        elfConfig.loadAsync()
            .then(function(data) {
                expect(data.users[lastname]['base-dir']).toBe('/home/charlie/');
                expect(data.users[lastname]['bootswatch']).toBeDefined();
                expect(data.users[lastname]['most-recent-date']).toBeDefined();
                expect(data.users[lastname]['site-dirs']).toBeDefined();
            })
            .catch(errorHandler)
            .then(done);
    });

    it('shows we can load the elf config', function() {
        elfConfig.useLocalConfig = false;
        const content = elfConfig.load();
        // [ 'users', 'selectedElvenImages', 'elvenImages' ]
        console.log(Object.keys(content));
        const home = elfUtils.ensureEndsWithPathSep(process.env.HOME);
        expect(content.users[lastname]['base-dir']).toBe(home);
    });

    it('shows we can get the root keys which name the items in the config file', function(done) {
        elfConfig.loadAsync()
            .then(function() {
                const keys = elfConfig.keys();
                expect(keys).toContain('users');
                expect(keys).toContain('selectedElvenImages');
                expect(keys).toContain('elvenImages');
                expect(keys.length).toBe(3);
            })
            .catch(errorHandler)
            .then(done);
    });

    it('shows we can get the lastname keys', function(done) {
        elfConfig.loadAsync()
            .then(function() {
                const keys = elfConfig.keys('users');
                expect(keys[0]).toBe(lastname);
            })
            .catch(errorHandler)
            .then(done);
    });

    it('shows we can configure', (done) => {
        elfConfig.loadAsync()
            .then(function(config) {
                const keys = Object.keys(config.users[lastname]);
                console.log(keys);
                expect(config.users[lastname]['base-dir']).toBe('/home/charlie/');
            })
            .catch(errorHandler)
            .then(done);
    });

    it('shows we can get the lastname base dir', function(done) {
        elfConfig.loadAsync()
            .then(function() {
                const dir = elfConfig.get('users', lastname, 'base-dir');
                expect(dir).toBe('/home/charlie/');
            })
            .catch(errorHandler)
            .then(done);
    });

    it('shows we can set the lastname base dir', (done) => {
        elfConfig.loadAsync()
            .then(function(config) {
                expect(config.users[lastname]['base-dir']).toBe('/home/charlie/');
                const dir = elfConfig.set('/home/bcuser/', 'users', lastname, 'base-dir');
                expect(config.users[lastname]['base-dir']).toBe('/home/bcuser/');
            })
            .catch(errorHandler)
            .then(done);
    });

    it('shows we can get the california elvenImages', function(done) {
        elfConfig.useLocalConfig = false;
        elfConfig.loadAsync()
            .then(function() {
                const california = elfConfig.getElvenImage('california');
                expect(california.baseDir).toBe('/var/www/html/images');
            })
            .catch(errorHandler)
            .then(done);
    });

});
