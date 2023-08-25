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
};
```

You must provide the targetOrigin. This is origin where you expect OpenChat to be hosted. To target the live OpenChat site this would be `https://oc.app` but it is also possible that you will want to run OpenChat locally while testing.

You may provide an initial path (without the origin) if you want to navigate to a specific community or chat on initalisation.

Finally you may provide some theme overrides so that OpenChat more closely resembles the look and feel of your own site. If you really want to change the style of something but can't work out how to do it, then get in touch and we can help.

The interface of the client library returned by the `initialise` function is extremely limited at the moment and only provides the following function:

```
changePath: (path: string) => void;
```

This allows you to delegate routing from your site to the OpenChat instance.

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
