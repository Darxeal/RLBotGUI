
import StoryStart from './story-mode-start.js'
import StoryChallenges from './story-challenges.js'

const UI_STATES = {
    'LOAD_SAVE': 0,
    'START_SCREEN': 1,
    'STORY_CHALLENGES': 2
}

export default {
    name: 'story',
    template: `
    <b-container fluid>
        <story-start v-on:started="startStory" v-if="ui_state === ${UI_STATES.START_SCREEN}">
        </story-start>

        <story-challenges v-on:launch_challenge="launchChallenge" v-bind:saveState="saveState" v-if="ui_state == ${UI_STATES.STORY_CHALLENGES}">
        </story-challenges>

        <b-button @click="deleteSave" variant="danger" v-if="ui_state > ${UI_STATES.START_SCREEN}">Delete Save</b-button>
        <b-button @click="startMatch()" class="mt-2">Test</b-button>
    </b-container>
    `,
    components: {
        'story-start': StoryStart,
        'story-challenges': StoryChallenges
    },
    data() {
        return {
            ui_state: UI_STATES.LOAD_SAVE,
            saveState: null, //figure this out
        }
    },
    methods: {
        storyStateMachine(targetState) {
            console.log(`Going from ${this.ui_state} to ${targetState}`)
            this.ui_state = targetState;
        },
        startMatch: async function (event) {
            console.log("startMatch")
            setTimeout(() => {
                console.log("gonna call eel")
                eel.story_story_test()
            }, 0);
        },
        startStory: async function (event) {
            console.log(event)
            state = await eel.story_new_save(event.teamname, event.teamcolor)()
            this.saveState = state
            this.storyStateMachine(UI_STATES.CITY_MAP)
        },
        deleteSave: async function() {
            await eel.story_delete_save()()
            this.saveState = null
            this.storyStateMachine(UI_STATES.START_SCREEN)
        },
        launchChallenge: function(name) {
            console.log(name)
            eel.launch_challenge(name)
        }
    },
    created: async function () {
        let state = await eel.story_load_save()();
        console.log(state);
        if (!state) {
            this.storyStateMachine(UI_STATES.START_SCREEN)
        }
        else {
            this.saveState = state
            this.storyStateMachine(UI_STATES.STORY_CHALLENGES)
        }
    },
}