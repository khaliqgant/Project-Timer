import _                from 'underscore';

import TimeTracker      from '../containers/TimeTracker';
import { updateTimer}   from '../actions';
import store            from '../store';

class PersistStore {
    constructor() {
        let state = store.getState();

        // Build a time tracker on every timer
        _.each(state.timers, (timer) => {
            let start = timer.started;

            timer.timeTracker = new TimeTracker(
                () => store.dispatch(updateTimer(timer.id)),
                {start}
            );
        });
    }
}

export default PersistStore;
