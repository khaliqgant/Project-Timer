import React, { PropTypes }         from 'react'
import { connect }                  from 'react-redux'
import _                            from 'underscore';

import TimerItem                    from '../components/TimerItem'
import Logger                       from '../components/Logger'
import { formatTime, getTimeIn }    from '../helpers'
import {
    stopTimer,
    startTimer,
    updateTimer,
    destroyTimer }                  from '../actions'

let Debug = new Logger('TimerList');

let TimerList = ({ timers, onClose, onStart, onStop }) => {

    return (
        <ul className="list-group">
            {_.map(timers, timer =>
                <TimerItem
                    {...timer}
                    onClose={() => onClose(timer.id)}
                    onStart={() => onStart(timer.id)}
                    onStop={() => onStop(timer.id)}
                    key={timer.id}
                />
            )}
        </ul>
    )
}

/**
 *
 * @desc Set component prop types
 * @type {Object}
 *
 */
TimerList.propTypes = {
    onClose: PropTypes.func.isRequired
}

/**
 *
 * @desc Modify the state to properties to passed onto the
 *       component
 *
 * @param  {Object} state
 * @return {Object}
 *
 */
const mapStateToProps = (state) => {
    let timers = _.map(state.timers, (timer) => {
        let duration = getTimeIn(timer.duration, 'seconds');
        timer.plannedTime = formatTime(timer.plannedTime);
        timer.displayDuration = formatTime(duration, 'seconds');

        return timer;
    });

    return {
        timers
    }
}

/**
 * @desc Maps the dispatcher onto properties to pass onto the
 *       component
 *
 * @type {Object}
 */
const mapDispatchToProps = {
    onClose: destroyTimer,
    onStart: startTimer,
    onStop: stopTimer,
}

TimerList = connect(
    mapStateToProps,
    mapDispatchToProps
)(TimerList);

export default TimerList;
