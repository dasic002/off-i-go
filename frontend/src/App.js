import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import React, { useState, useEffect } from "react";
import BaseWidget from "./components/BaseWidget";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";

function App() {
  const [deviceSize, setDeviceSize] = useState("mobile");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 500) {
        setDeviceSize("mobile");
      } else {
        setDeviceSize("desktop");
      }
    };

    handleResize(); // Set initial device size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }
  , []);

  return (
    <div className={styles.App}>
      <NavBar device={deviceSize}/>
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <div>
                  <h1>Welcome to Off I Go!</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aenean ut libero eleifend, laoreet lacus et, ultrices ante.
                    Fusce nibh ante, fermentum non magna et, pulvinar sagittis
                    lacus. Nullam laoreet, urna eu tincidunt eleifend, est nisl
                    vulputate ex, nec tempor dui libero non massa. Praesent
                    congue lectus vel fringilla bibendum. Cras scelerisque
                    aliquam elit vel placerat. Mauris mollis eget erat efficitur
                    eleifend. Curabitur in condimentum neque. Donec ac felis
                    libero. Nulla augue nulla, facilisis ac lorem et, tristique
                    suscipit sem. Nam et dolor maximus, condimentum ex non,
                    auctor libero. Phasellus id imperdiet est, at iaculis felis.
                    Curabitur vel ex id mi porttitor imperdiet. Curabitur mattis
                    ante ac orci venenatis, et molestie nulla sagittis. Cras
                    fringilla felis eget neque euismod blandit. Sed ac sapien
                    non risus ornare lacinia bibendum eu leo. Vestibulum quis
                    feugiat mauris. Phasellus at est a risus ornare
                    sollicitudin. Nullam porttitor, eros ac finibus condimentum,
                    odio arcu luctus mauris, tempor vulputate neque leo vel
                    augue. Nunc commodo faucibus vestibulum. Nam pretium mattis
                    lacus vitae sollicitudin. Pellentesque vitae dui vel urna
                    varius tristique. Nunc consequat nec tellus et pellentesque.
                    Duis id nisi ut risus lobortis interdum. Nam eget nunc eget
                    ex luctus ullamcorper. Donec sodales mauris ut nisi tempus
                    ullamcorper. Nam tincidunt, sapien et mollis auctor, massa
                    enim posuere libero, quis rutrum metus sapien eget quam. Ut
                    lectus elit, dignissim a venenatis vitae, sodales vitae
                    lorem. Proin ultrices facilisis urna, et ultrices arcu
                    pharetra vitae. Donec tincidunt quam ex, vitae congue tellus
                    luctus id. Nunc at sapien nec enim egestas tempus. Donec
                    lacinia metus nec dolor blandit, gravida feugiat sem
                    aliquet. Integer lacinia eget diam non consectetur. Quisque
                    in augue vitae turpis sodales fringilla. Pellentesque vel
                    volutpat libero, ut lacinia nunc. Praesent vel tincidunt
                    velit. Sed mollis nisl non velit dictum iaculis. Ut
                    vestibulum ipsum erat, in feugiat lacus ultricies vel. Donec
                    dapibus hendrerit metus eu lobortis. Donec fermentum
                    imperdiet nulla, et lacinia velit laoreet quis. Sed ac
                    tempus quam. Phasellus dictum felis eget nibh egestas
                    ornare. Morbi id posuere velit. Nullam ac consectetur
                    sapien. Nam condimentum ex iaculis hendrerit rutrum. Donec
                    faucibus risus neque, eget egestas orci blandit eget.
                    Curabitur consequat congue sem, id suscipit eros viverra
                    non. Morbi eu lectus dolor. Ut luctus nisi leo, nec
                    efficitur justo luctus nec. Cras rhoncus tempor nunc ut
                    imperdiet. Donec eu tempus velit. Maecenas dictum dui id dui
                    sodales, at eleifend est accumsan. Integer sed hendrerit
                    enim.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Aenean ut libero eleifend, laoreet lacus et, ultrices ante.
                    Fusce nibh ante, fermentum non magna et, pulvinar sagittis
                    lacus. Nullam laoreet, urna eu tincidunt eleifend, est nisl
                    vulputate ex, nec tempor dui libero non massa. Praesent
                    congue lectus vel fringilla bibendum. Cras scelerisque
                    aliquam elit vel placerat. Mauris mollis eget erat efficitur
                    eleifend. Curabitur in condimentum neque. Donec ac felis
                    libero. Nulla augue nulla, facilisis ac lorem et, tristique
                    suscipit sem. Nam et dolor maximus, condimentum ex non,
                    auctor libero. Phasellus id imperdiet est, at iaculis felis.
                    Curabitur vel ex id mi porttitor imperdiet. Curabitur mattis
                    ante ac orci venenatis, et molestie nulla sagittis. Cras
                    fringilla felis eget neque euismod blandit. Sed ac sapien
                    non risus ornare lacinia bibendum eu leo. Vestibulum quis
                    feugiat mauris. Phasellus at est a risus ornare
                    sollicitudin. Nullam porttitor, eros ac finibus condimentum,
                    odio arcu luctus mauris, tempor vulputate neque leo vel
                    augue. Nunc commodo faucibus vestibulum. Nam pretium mattis
                    lacus vitae sollicitudin. Pellentesque vitae dui vel urna
                    varius tristique. Nunc consequat nec tellus et pellentesque.
                    Duis id nisi ut risus lobortis interdum. Nam eget nunc eget
                    ex luctus ullamcorper. Donec sodales mauris ut nisi tempus
                    ullamcorper. Nam tincidunt, sapien et mollis auctor, massa
                    enim posuere libero, quis rutrum metus sapien eget quam. Ut
                    lectus elit, dignissim a venenatis vitae, sodales vitae
                    lorem. Proin ultrices facilisis urna, et ultrices arcu
                    pharetra vitae. Donec tincidunt quam ex, vitae congue tellus
                    luctus id. Nunc at sapien nec enim egestas tempus. Donec
                    lacinia metus nec dolor blandit, gravida feugiat sem
                    aliquet. Integer lacinia eget diam non consectetur. Quisque
                    in augue vitae turpis sodales fringilla. Pellentesque vel
                    volutpat libero, ut lacinia nunc. Praesent vel tincidunt
                    velit. Sed mollis nisl non velit dictum iaculis. Ut
                    vestibulum ipsum erat, in feugiat lacus ultricies vel. Donec
                    dapibus hendrerit metus eu lobortis. Donec fermentum
                    imperdiet nulla, et lacinia velit laoreet quis. Sed ac
                    tempus quam. Phasellus dictum felis eget nibh egestas
                    ornare. Morbi id posuere velit. Nullam ac consectetur
                    sapien. Nam condimentum ex iaculis hendrerit rutrum. Donec
                    faucibus risus neque, eget egestas orci blandit eget.
                    Curabitur consequat congue sem, id suscipit eros viverra
                    non. Morbi eu lectus dolor. Ut luctus nisi leo, nec
                    efficitur justo luctus nec. Cras rhoncus tempor nunc ut
                    imperdiet. Donec eu tempus velit. Maecenas dictum dui id dui
                    sodales, at eleifend est accumsan. Integer sed hendrerit
                    enim.
                  </p>
                </div>
              );
            }}
          />
          <Route exact path="/signin" render={() => <h1>Sign in</h1>} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
      <BaseWidget device={deviceSize} />
    </div>
  );
}

export default App;
