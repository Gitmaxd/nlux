import {AdapterBuilder} from '../types/adapterBuilder';
import {ConversationItem} from '../types/conversation';
import {EventCallback, EventName, EventsMap} from '../types/event';
import {NluxProps} from '../types/props';
import {HighlighterExtension} from './highlighter/highlighter';
import {ConversationOptions} from './options/conversationOptions';
import {LayoutOptions} from './options/layoutOptions';
import {PersonaOptions} from './options/personaOptions';
import {PromptBoxOptions} from './options/promptBoxOptions';

export interface IAiChat {
    hide(): void;
    mount(rootElement: HTMLElement): void;
    get mounted(): boolean;

    on(event: EventName, callback: EventsMap[EventName]): IAiChat;
    removeAllEventListeners(event?: EventName): void;
    removeEventListener(event: EventName, callback: EventCallback): void;

    show(): void;
    unmount(): void;
    updateProps(props: Partial<NluxProps>): void;

    withAdapter<InboundPayload, OutboundPayload>(
        adapterBuilder: AdapterBuilder<InboundPayload, OutboundPayload>,
    ): IAiChat;
    withClassName(
        className: string,
    ): IAiChat;
    withConversationHistory(
        conversationHistory: ConversationItem[],
    ): IAiChat;
    withConversationOptions(
        conversationOptions: ConversationOptions,
    ): IAiChat;
    withLayoutOptions(
        layoutOptions: LayoutOptions,
    ): IAiChat;
    withPersonaOptions(
        personaOptions: PersonaOptions,
    ): IAiChat;
    withPromptBoxOptions(
        promptBoxOptions: PromptBoxOptions,
    ): IAiChat;
    withSyntaxHighlighter(
        syntaxHighlighter: HighlighterExtension,
    ): IAiChat;
    withTheme(
        themeId: string,
    ): IAiChat;
}
