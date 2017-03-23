import moment from 'moment';

import * as actions from '../src/js/actions'

/** Test Actions */
describe('actions', () => {

    /** TIMER_ADD */
    it('should create an action to add a timer', () => {
        let id = moment.now();
        const timer = {
            id,
            title: 'New title',
            createdTime: id,
            started: false,
            duration: 0,
            plannedTime: '00:00:00',
        };

        const expectedAction = {
            type: 'TIMER_ADD',
            payload: timer
        };

        expect(actions.addTimer(timer)).toEqual(expectedAction);
    });

    /** TIMER_DESTROY */
    it('should create an action to destroy a timer', () => {
        let id = moment.now();

        const expectedAction = {
            type: 'TIMER_DESTROY',
            payload: id
        };

        expect(actions.destroyTimer(id)).toEqual(expectedAction);
    });

    /** TIMER_START */
    it('should create an action to start a timer', () => {
        let id = moment.now();

        const expectedAction = {
            type: 'TIMER_START',
            payload: id
        };

        expect(actions.startTimer(id)).toEqual(expectedAction);
    });

    /** TIMER_STOP */
    it('should create an action to stop a timer', () => {
        let id = moment.now();

        const expectedAction = {
            type: 'TIMER_STOP',
            payload: id
        };

        expect(actions.stopTimer(id)).toEqual(expectedAction);
    });

    /** TIMER_TOGGLE */
    it('should create an action to toggle a timer', () => {
        let id = moment.now();

        const expectedAction = {
            type: 'TIMER_TOGGLE',
            payload: id
        };

        expect(actions.toggleTimer(id)).toEqual(expectedAction);
    });

    /** TIMER_TITLE_CHANGE_OFF */
    it('should create an action to change a timer\'s title on', () => {
        let id = moment.now();

        const expectedAction = {
            type: 'TIMER_TITLE_CHANGE_ON',
            payload: id
        };

        expect(actions.toggleTitleChangeOn(id)).toEqual(expectedAction);
    });

    /** TIMER_TITLE_CHANGE_OFF */
    it('should create an action to change a timer\'s title off', () => {
        let id = moment.now();

        const expectedAction = {
            type: 'TIMER_TITLE_CHANGE_OFF',
            payload: id
        };

        expect(actions.toggleTitleChangeOff(id)).toEqual(expectedAction);
    });

    /** TIMER_TITLE_UPDATE */
    it('should create an action to update a timer\'s title', () => {
        let id = moment.now();
        let title = 'Timer title';

        const expectedAction = {
            type: 'TIMER_TITLE_UPDATE',
            payload: {id, title}
        };

        expect(actions.updateTitle(id, title)).toEqual(expectedAction);
    });
});
