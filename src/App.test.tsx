import React from "react";
import { Provider } from "react-redux";
import Adapter from "enzyme-adapter-react-16";
import configureStore from "redux-mock-store";
import { act } from "react-dom/test-utils";
import { mount, configure } from "enzyme";
import renderer from "react-test-renderer";

import App from "./App";
import { getDataInit } from "./redux/actions/data.actions";

const mockStore = configureStore([]);
configure({ adapter: new Adapter() });

describe("App", () => {
  let store: any;
  let component: React.FC | any;

  beforeEach(() => {
    store = mockStore({
      data: { loading: true }
    });

    store.dispatch = jest.fn();

    act(() => {
      component = mount(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });
  });

  it("should render the component with a redux store", () => {
    const mockComponent = renderer
      .create(
        <Provider store={store}>
          <App />
        </Provider>
      )
      .toJSON();

    expect(mockComponent).toMatchSnapshot();
  });

  it("should call action to get data", () => {
    expect(store.dispatch).toHaveBeenCalledWith(getDataInit());
  });

  it("should render gameboard component if loading is true", () => {
    const store = mockStore({
      data: {
        loading: false
      },
      match: {
        ready: false
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(wrapper.find("Gameboard")).toHaveLength(1);
  });

  it("should hide gameboard component if loading is false", () => {
    const store = mockStore({
      data: {
        loading: true
      },
      match: {
        ready: false
      }
    });

    const wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(wrapper.find("Gameboard")).toHaveLength(0);
  });
});
