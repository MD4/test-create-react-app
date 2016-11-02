import React from 'react';
import {Observable, Subject} from 'rx';
import {RxService} from 'reactx';

const fakeFetch = (data) => new Promise(
  resolve => setTimeout(resolve, 1000, data)
);

export default RxService({

  subStreams: {
    fetchYolo$: ($, _, {events}) => $
      .flatMap(
        () => Observable
          .fromPromise(fakeFetch({yolo: `Y0L0-$W4G ${(Math.random() * 100) << 0}%`}))
          .map(event => (event.type = events.yoloFetched) && event)
      ),
    fetchSwag$: ($, _, {events}) => $
      .flatMap(
        () => Observable
          .fromPromise(fakeFetch({swag: `${(Math.random() * 10000) << 0}$`}))
          .map(event => (event.type = events.swagFetched) && event)
      )
  },

  events: {
    yoloFetching: 'yolo-fetching',
    swagFetching: 'swag-fetching',
    yoloFetched: 'yolo-fetched',
    swagFetched: 'swag-fetched'
  },

  exposes: ({subStreams, events}) => ({

    fetchYolo() {
      console.log(123, subStreams)
      subStreams.fetchYolo$.onNext({type: events.yoloFetching});
      return {type: events.yoloFetching};
    },

    fetchSwag() {
      console.log(123, subStreams)
      subStreams.fetchSwag$.onNext({type: events.swagFetching});
      return {type: events.swagFetching};
    }

  })

});