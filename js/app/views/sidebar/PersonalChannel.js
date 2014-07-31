  /*
 * Copyright 2012 buddycloud
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function(require) {
  var avatarFallback = require('util/avatarFallback');
  var config = require('config');
  var Backbone = require('backbone');
  var template = require('text!templates/sidebar/personalChannel.html');
  var l10nBrowser = require('l10n-browser');
  var Events = Backbone.Events;
  var localTemplate;

  var PersonalChannel = Backbone.View.extend({
    className: 'personal channel',
    events:
      {
        'click .logout': '_logout',
        'click .metadata': '_navigate',
        'click .noSelect': 'showSettings',
        'click .showSettings' : 'hideSettings',
        'click .preferences': '_loadPrefs',
        'click .newChannel': '_loadCreateChannel'
      },

    initialize: function() {
      if (!localTemplate) localTemplate = l10nBrowser.localiseHTML(template, {});
      this.metadata = this.model.metadata(this.model.username());
      this.listenTo(this.metadata, 'change', this.render);
      if (!this.metadata.hasEverChanged()) {
        this.metadata.fetch({credentials: this.model.credentials});
      } else {
        this.render();
      }

      _.bindAll(this, 'showSettings', 'hideSettings');

      // Avatar changed event
      Events.on('avatarChanged', this._avatarChanged, this);

      // Metadata changed event
      Events.on('metadataChanged', this._metadataChanged, this);

      // Unread counters events
      Events.on('personalChannelTotalCount', this._renderTotalCount, this);
      Events.on('personalChannelMentionsCount', this._renderMentionsCount, this);
    },

    _avatarChanged: function(channel) {
      if (channel === this.model.username()) {
        var $imgEl = this.$el.find('img');
        $imgEl.attr('src', this.metadata.avatarUrl(50) + '&' + new Date().getTime());
      }
    },

    _metadataChanged: function(channel) {
      if (this.metadata.channel === channel) {
        this.metadata.fetch({credentials: this.model.credentials});
      }
    },

    _renderTotalCount: function(count) {
      var countEl = this.$el.find('.channelpost');
      this._showOrHideCount(countEl, count);
    },

    _renderMentionsCount: function(count) {
      var countEl = this.$el.find('.admin');
      this._showOrHideCount(countEl, count);
    },

    _showOrHideCount: function(countEl, count) {
      if (count > 0) {
        if (count > 30) {
          countEl.text('30+');
        } else {
          countEl.text(count);
        }
        countEl.show();
      } else {
        countEl.hide();
      }
    },

    render: function() {
      this.$el.html(_.template(localTemplate, {
        metadata: this.metadata
      }));
      avatarFallback(this.$('.avatar img'), this.metadata.channelType(), 50);
    },

    _logout: function() {
      var username = this.model.credentials.username;
      this.model.logout();
      
      // Return to WelcomePage
      if (config.useURLHostAsDomain) {
        Events.trigger('navigate', '?h=' + username.split('@')[1]);
      } else {
        Events.trigger('navigate', '/');
      }
    },

    selectChannel: function(channel) {
      this.selected = (this.metadata.channel === channel);
      if (this.selected) {
        this.$el.addClass('selected');
      } else {
        this.$el.removeClass('selected');
      }
    },

    _navigate: function() {
      Events.trigger('navigate', this.model.username());
    },

    _loadPrefs: function() {
      Events.trigger('navigate', 'prefs');
    },

    _loadCreateChannel: function() {
      Events.trigger('navigate', 'new-channel');
    },

    showSettings: function(event) {
      var $settings = this.$('.settings');
      var $settingsPopup = $settings.find('.popup');
      var settingsPopupLeft = (($settingsPopup.width() - 35) / 2) * -1;
      event.stopPropagation();
      $settings.removeClass('noSelect').addClass('showSettings');
      $settingsPopup.css('left', settingsPopupLeft + 'px');

      // Hide settings clicking elsewhere
      $('body, html').one('click', this.hideSettings);
    },

    hideSettings: function() {
      this.$('.settings').removeClass('showSettings').addClass('noSelect');
    }
  });

  return PersonalChannel;
});
