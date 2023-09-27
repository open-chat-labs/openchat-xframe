# OpenChat XFrame library

OpenChat can be hosted in an iframe to easily add chat functionality to your own site.

This library makes it easier to communicate with OpenChat via the iframe.

## Pre-requisites

OpenChat can only be hosted in an iframe by agreement. By default OpenChat will not render in an iframe. To proceed you will need to request access to the origin you will be using to host OpenChat. You may wish to provide a test origin and a live origin for us to whitelist.

## Installation

Install the library into your site in the normal way:

```
npm i @open-ic/openchat-xframe
```

## Usage

The library provides an `initialise` function which accepts a reference to the iframe in which you wish to host OpenChat. This function will return a `Promise<OpenChatXFrame>` which is a client that can be used for subsequent interaction with OpenChat.

The `initialise` function expects the following parameters:

### iframe (HTMLIFrameElement)

This should be a referrence to the iframe in which you wish to host OpenChat

### options (OpenChatXFrameOptions)

```ts
type OpenChatXFrameOptions = {
    theme?: ThemeOverride;
    targetOrigin: string;
    initialPath?: string;
    delegateNavigation?: boolean; // defaults to false
};
```

You must provide the targetOrigin. This is origin where you expect OpenChat to be hosted. To target the live OpenChat site this would be `https://oc.app` but it is also possible that you will want to run OpenChat locally while testing.

You may provide an initial path (without the origin) if you want to navigate to a specific community or chat on initalisation.

You may provide some theme overrides so that OpenChat more closely resembles the look and feel of your own site. If you really want to change the style of something but can't work out how to do it, then get in touch and we can help.

You may also choose whether or not the OpenChat instance within the iframe should delegate navigation events back to the host site. If we to true, when a navigation event occurs within OpenChat, for example if the user selects a chat, rather than the OpenChat instance handling that navigation event and switching the UI to the selected chat, it will send the path to which it would ordinarily navigate to the host site. This is useful if you wish to split your integration into two frames. Perhaps a left frame showing a list of direct chats and a right frame showing just the selected chat. In this example, you would set `delegateNavigation` to true on the left hand frame and subscribe to changePath events on the OpenChatXFrame client. When you receive such an event you can call `changePath` on the right hand instance of OpenChat.

The interface of the client library returned by the `initialise` function is extremely limited at the moment and only provides the following function:

```
changePath: (path: string) => void;
onChangePath: (callback: (path: string) => void);
```

This allows you to delegate routing from your site to the OpenChat instance and vice versa.

We may add more functions to this interface in future.

## Example Usage

```html
<div class="chat">
    <div class="header">
        <h3>Chat</h3>
    </div>

    <iframe bind:this="{iframe}" title="OpenChat" frameborder="0" />
</div>
```

```ts
import { initialise } from '@open-ic/openchat-xframe';

const client = await initialise(iframe, {
    targetOrigin: 'https://oc.app',
    delegateNavigation: false,
    initialPath:
        '/community/rfeib-riaaa-aaaar-ar3oq-cai/channel/334961401678552956581044255076222828441',
    theme: {
        name: 'my-app-theme',
        base: 'dark',
        overrides: {
            primary: "green",
            bd: 'rgb(91, 243, 190)',
            bg: 'transparent',
            txt: "black",
            placeholder: "green",
            'txt-light': '#75c8af',
            timeline: {
                txt: "yellow"
            },
            ... // more theme overrides
        }
    }
});
```

## Limitations

### User mapping

At the moment this is simply a window onto the existing OpenChat site. This means that to use it, the user must have an OpenChat account and that account will have no relationship with any user account that the user may have on _your_ site. This might mean that your user has to effectively log in twice - once to your site and once to OpenChat.

Of course, this is not good enough for everyone and some sort of link / mapping between the users would be ideal. What we are delivering is a minimun viable product and we will continue to improve it over time.

### Look and feel

Integrating via iframe doesn't give me enough control over the features and the look and feel - why can't you just give me an api? There are many ways that integration can be achieved. Integrating via iframe has a number of key advantages. Firstly, it is simple. You don't need to worry about writing the UI code yourself (and trust me - it's complicated). Secondly, it's always up to date. If we update OpenChat then that's the version that gets rendered in your iframe. This way we minimise the risk of breaking changes to downstream users. Finally, it is more secure. The smaller the surface area we expose to third parties the better. We don't want to have to trust the practices of all of the teams that choose to embed OpenChat.

That said - it is also possible that we may develop a set of more flexible web components or indeed a full api in the future. Those future developments will need to be driven by concrete use-cases that emerge.
