/*
 * Copyright 2012 Denis Washington <denisw@online.de>
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

define([
    'backbone',
    'app/models/ChannelNode',
    'app/models/ChannelFollowers',
    'app/models/util'
], function(Backbone, ChannelNode, ChannelFollowers, util) {

    var Channel = Backbone.Model.extend({
        initialize: function() {
            this.posts = new ChannelNode();
            this.posts.channel = this;
            this.posts.name = 'posts';
            this.followers = new ChannelFollowers();
            this.followers.channel = this;
        },

        url: function() {
            return util.apiUrl(this.get('channel'), 'metadata', 'posts');
        },

        iconUrl: function() {
            return util.apiUrl(this.get('channel'), 'media', 'avatar');
        }
    });

    return Channel;
});