import _        from 'underscore';
import moment   from 'moment';
import Storage  from '../helpers/Storage';
import Logger   from '../components/Logger';

/* eslint-disable no-unused-vars */
let Debug = new Logger('Reducer');
/* eslint-enable no-unused-vars */

export default function reducer(state={
    timers: []
}, action) {

    switch(action.type) {
        case 'TIMER_ADD': {
            let newTimer = action.payload;
            let id = newTimer.id;
            let newState = _.assign({}, state);

            // Add local storage entry
            Storage.set(id, newTimer);

            newState.timers.push(newTimer);

            return newState;
        }

        case 'TIMER_DESTROY': {
            let id = action.payload;
            let newState = _.assign({}, state);

            // Remove timer from timers array
            newState.timers = _.reject(newState.timers, (timer) => {
                if (timer.id === id) {

                    // Stop if running
                    if (timer.started) {
                        timer.timeTracker.stop();
                    }

                    return timer;
                }
            });

            // Remove from localStorage
            // TODO find way to add prefix
            Storage.remove(['projectTimer:'+id]);

            return newState;
        }

        case 'TIMER_TOGGLE': {
            let id = action.payload;
            let newState = _.assign({}, state);

            // Pause running timer and toggle matching timer by ID
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.started = !timer.started;

                    // Update local storage
                    Storage.set(id, timer);
                } else {
                    timer.started = false;
                }

                // Start/Stop timer
                if (timer.started) {
                    timer.startTime = moment.now();
                    timer.timeTracker.start();
                } else {
                    timer.endTime = moment.now();
                    timer.timeTracker.stop();
                }

                return timer;
            });

            return _.assign({}, state, newState);
        }

        case 'TIMER_START': {
            let id = action.payload;
            let newState = _.assign({}, state);

            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.started = true;
                    timer.startTime = moment.now();
                    delete timer.editingTitle;

                    // Start time tracker
                    timer.timeTracker.start();

                    // Update local storage
                    Storage.set(id, timer);
                }

                return timer;
            });

            return _.assign({}, state, newState);
        }

        case 'TIMER_STOP': {
            let id = action.payload;
            let newState = _.assign({}, state);

            newState.timers = _.map(newState.timers, (timer) => {

                if (timer.id === id) {
                    timer.started = false;
                    timer.endTime = moment.now();
                    // Save duration in case we want to start timer again
                    timer.durationCycle = timer.duration;

                    // Stop time tracker
                    timer.timeTracker.stop();

                    // Update local storage
                    Storage.set(id, timer);
                }

                return timer;
            });

            return _.assign({}, state, newState);
        }

        case 'TIMER_RESET': {
            let id = action.payload;
            let newState = _.assign({}, state);

            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.duration = 0;
                    delete timer.durationCycle;

                    // Reset the start date so we can start again from 0
                    timer.startTime = moment.now();

                    // Update local storage entry
                    Storage.set(id, timer);
                }

                return timer;
            });

            return _.assign({}, state, newState);
        }

        case 'TIMER_UPDATE': {
            let id = action.payload;
            let newState = _.assign({}, state);

            // Update the total duration of the running timer
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    // Set duration as milliseconds count from the startTime
                    let currentTime = moment();
                    let timeDiff = currentTime.diff(timer.startTime);
                    timeDiff = moment.duration(timeDiff).asMilliseconds();

                    // Check to see if we have run this previously and combine the total duration
                    timer.duration = (timer.durationCycle) ?
                        (timeDiff + timer.durationCycle) :
                        timeDiff;

                    // Update local storage entry
                    Storage.set(id, timer);
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_TITLE_CHANGE_ON': {
            let id = action.payload;
            let newState = _.assign({}, state);

            // Set editingTitle prop as true
            newState.timers = _.map(newState.timers, (timer) => {
                // Add editingTitle
                if (timer.id === id) {
                    timer.editingTitle = true;
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_TITLE_CHANGE_OFF': {
            let id = action.payload;
            let newState = _.assign({}, state);

            // Delete editingTitle
            newState.timers = _.map(newState.timers, (timer) => {
                // Delete editingTitle prop
                if (timer.id === id) {
                    delete timer.editingTitle;
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_TITLE_UPDATE': {
            let id = action.payload.id;
            let title = action.payload.title;
            let newState = _.assign({}, state);

            // Update title
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.title = title;
                    delete timer.editingTitle;

                    // Update local storage entry
                    Storage.set(id, timer);
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_DURATION_ON': {
            let id = action.payload.id;
            let newState = _.assign({}, state);

            // Set `editingDuration` as true
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.editingDuration = true;

                    // Stop the timer if is running
                    if (timer.started) {
                        timer.timeTracker.stop();
                        timer.started = false;
                    }
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_DURATION_OFF': {
            let id = action.payload.id;
            let newState = _.assign({}, state);

            // Delete `editingDuration` prop
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    delete timer.editingDuration;
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_DURATION_UPDATE': {
            let { id, timeStr } = action.payload;
            let newState = _.assign({}, state);

            /**
             * To update the timer's duration we have to parse the duration string
             * from the payload, and set both duration and durationCycle to that
             * duration, then we reset the startTime prop to allow the timer
             * to resume and save to localStorage
             *
             * @TODO: Look into a way to parse `timeStr` with ISO 8601
             */
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.duration = moment.duration(timeStr).asMilliseconds();
                    timer.durationCycle = timer.duration;
                    timer.startTime = moment.now();
                    delete timer.editingDuration;

                    // Update local storage entry
                    Storage.set(id, timer);
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_PLANNED_ON': {
            let id = action.payload.id;
            let newState = _.assign({}, state);

            // Set `editingPlannedTime` as true
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.editingPlannedTime = true;

                    // Stop the timer if is running
                    if (timer.started) {
                        timer.timeTracker.stop();
                        timer.started = false;
                    }
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_PLANNED_OFF': {
            let id = action.payload.id;
            let newState = _.assign({}, state);

            // Delete `editingDuration` prop
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    delete timer.editingDuration;
                }

                return timer;
            });

            return newState;
        }

        case 'TIMER_PLANNED_UPDATE': {
            let { id, timeStr } = action.payload;
            let newState = _.assign({}, state);

            /**
             * To update the timer's planned time we have to parse the duration string
             * from the payload, and set both duration and durationCycle to that
             * duration, then we reset the startTime prop to allow the timer
             * to resume and save to localStorage
             * @TODO: Look into a way to parse `timeStr` with ISO 8601
             */
            newState.timers = _.map(newState.timers, (timer) => {
                if (timer.id === id) {
                    timer.plannedTime = moment.duration(timeStr).asMilliseconds();
                    delete timer.editingPlannedTime;

                    // Update local storage entry
                    Storage.set(id, timer);
                }

                return timer;
            });

            return newState;
        }

    }

    return state;
}
