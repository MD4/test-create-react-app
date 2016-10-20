import React, {Component} from 'react';
import {Subject} from 'rx';

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
      childs = [],
      store = {},
      reducer = (store, reducer) => store,
      subStreams$ = []
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

    if (subStreams$.length) {
      stream$ = stream$
        .merge(...subStreams$)
    }
    stream$ = stream$
      .map(populateEvent);


    const updateStream$ = stream$
      .scan(reducer, store)
      .share();

    const RxComponent = React.createClass(_.extend({
        stream$,
        updateStream$,
        store,
        reducer,
        childs,

        componentDidMount() {
          this.subscribtion = updateStream$
            .forEach(this.setState.bind(this));
        },

        componentWillUnmount() {
          this.subscribtion.dispose();
        }

      },
      clazz
    ));

    RxComponent.store = store;
    RxComponent.reducer = reducer;
    RxComponent.childs = childs;
    RxComponent.stream$ = stream$;
    RxComponent.updateStream$ = updateStream$;

    return RxComponent;

  };

