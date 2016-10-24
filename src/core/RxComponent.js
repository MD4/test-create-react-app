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
      event.key = event.from
        .reverse()
        .concat(event.type)
        .join(':');
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
      childsStreams$.forEach(childsStream$ => (stream$ = stream$.merge(childsStream$)));
    }

    if (subStreams$.length) {
      subStreams$.forEach(subStream$ => (stream$ = stream$.merge(subStream$)));
    }
    stream$ = stream$
      .map(populateEvent);


    const updateStream$ = stream$
      .scan(reducer, store)
      .filter(state => !_.isEmpty(state))
      .share();

    const RxComponent = React.createClass(_.extend({
        id,
        store,
        reducer,
        childs,

        stream$,
        updateStream$,

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

    RxComponent.id = id;
    RxComponent.store = store;
    RxComponent.reducer = reducer;
    RxComponent.childs = childs;

    RxComponent.stream$ = stream$;
    RxComponent.updateStream$ = updateStream$;

    return RxComponent;

  };

