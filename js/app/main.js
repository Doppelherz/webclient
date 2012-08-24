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

requirejs.config({baseUrl: 'js'});

define([
    'jquery',
    'app/models/Channel',
    'app/models/UserCredentials',
    'app/views/UserBar',
    'app/views/MetadataPane',
    'app/views/FollowerList',
    'app/views/PostStream'
], function(
    $,
    Channel,
    UserCredentials,
    UserBar,
    MetadataPane,
    FollowerList,
    PostStream
) {
    $('#channel-view').css('min-height', window.innerHeight + 'px');

    var channelArg = location.search.match(/[\?\&]channel=([^\&]*)/);
    var channelId = channelArg ? channelArg[1] : 'lounge@topics.buddycloud.org';

    var credentials = new UserCredentials();
    var channel = new Channel({
        channel: channelId,
        node: 'posts'
    });

    var userBar = new UserBar({
        model: credentials
    });

    var metaView = new MetadataPane({
        model: channel
    });

    var followersView = new FollowerList({
        model: channel.followers
    });

    var postsView = new PostStream({
        model: channel.posts,
        credentials: credentials
    });

    $('#toolbar').append(userBar.el);
    $('#channel-view').append(followersView.el);
    $('#channel-view').append(metaView.el);
    $('#channel-view').append(postsView.el);

    channel.fetch();
    channel.followers.fetch();
    channel.posts.fetch();
});
