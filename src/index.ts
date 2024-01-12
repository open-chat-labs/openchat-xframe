import type { OpenChatXFrame, OpenChatXFrameOptions } from "./types";

function debug(msg: string, ...params: unknown[]): void {
    console.debug(`OPENCHAT_XFRAME_HOST: ${msg}`, params);
}

function isFrameLoaded(iframe: HTMLIFrameElement) {
    return (
        iframe && iframe.contentWindow && iframe.contentWindow.document.readyState === "complete"
    );
}

async function onFrameLoaded(
    iframe: HTMLIFrameElement,
    options: OpenChatXFrameOptions,
): Promise<OpenChatXFrame> {
    debug("iframe loaded");
    return new Promise((resolve) => {
        debug("listening for openchat ready");
        window.addEventListener("message", (ev) => {
            debug("received message on window", ev);
            if (ev.origin === options.targetOrigin && ev.data === "openchat_ready") {
                if (options.settings !== undefined) {
                    sendMessage(iframe, options.targetOrigin, {
                        kind: "override_settings",
                        settings: options.settings,
                    });
                }
                if (options.theme !== undefined) {
                    sendMessage(iframe, options.targetOrigin, {
                        kind: "update_theme",
                        base: options.theme.base,
                        name: options.theme.name,
                        overrides: options.theme.overrides,
                    });
                }
                resolve({
                    logout: () => {
                        sendMessage(iframe, options.targetOrigin, {
                            kind: "logout",
                        });
                    },
                    changePath: (path: string) => {
                        sendMessage(iframe, options.targetOrigin, {
                            kind: "change_route",
                            path,
                        });
                    },
                });
            }
            if (
                ev.origin === options.targetOrigin &&
                ev.data &&
                ev.data.kind === "openchat_user_logged_in"
            ) {
                if (options.onUserIdentified) {
                    options.onUserIdentified(ev.data.userId);
                }
            }
        });
    });
}

export function initialise(
    iframe: HTMLIFrameElement,
    options: OpenChatXFrameOptions,
): Promise<OpenChatXFrame> {
    return new Promise<OpenChatXFrame>((resolve) => {
        iframe.src = options.initialPath
            ? `${options.targetOrigin}${options.initialPath}`
            : options.targetOrigin;
        if (isFrameLoaded(iframe)) {
            onFrameLoaded(iframe, options).then(resolve);
        } else {
            iframe.addEventListener("load", () => {
                onFrameLoaded(iframe, options).then(resolve);
            });
        }
    });
}

function sendMessage(frame: HTMLIFrameElement, targetOrigin: string, msg: unknown) {
    debug("sending message", msg);
    if (frame && frame.contentWindow) {
        try {
            frame.contentWindow.postMessage(msg, targetOrigin);
        } catch (err) {
            debug("Error sending message to iframe", err);
        }
    }
}
