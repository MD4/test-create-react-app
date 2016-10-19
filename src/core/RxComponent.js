import React, { Component } from 'react';
import { Subject } from 'rx';
import _ from 'lodash';

export default clazz =>
  (id = Symbol()) => {
    const populateEvent = event => {
      event = JSON.parse(JSON.stringify(event));
      if (!event.from) {
        event.from = [];
      }
      event.from.push(id);
      return event;
    };

    const {
      childs={},
      reducer=_.noop,
      store={}
    } = clazz;

    const childsStreams$ = _(childs)
      .values()
      .map('stream$')
      .value();

    let stream$ = new Subject();

    if (childsStreams$.length) {
      stream$ = stream$
        .merge(...childsStreams$)
    }

    stream$ = stream$.map(populateEvent);

    const updateStream$ = stream$
      .scan(reducer, store)
      .share();

    const component = React.createClass(
      _.extend({

        componentDidMount() {
          this.subscribtion = updateStream$
            .forEach(this.setState.bind(this));
        },

        componentWillUnmount() {
          this.subscribtion.dispose();
        }

      }, clazz)
    );

    component.stream$ = stream$;

    return component;
  };

