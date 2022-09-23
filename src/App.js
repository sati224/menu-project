import React, { Component } from "react";
import axios from "axios";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Categories from "./components/Categories";
import MainMenu from "./components/MainMenu";
import SearchInput from "./components/SearchInput";
import CartOffCanvas from "./components/CartOffCanvas";
import RangeSlider from "./components/RangeSlider";

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filteredData: [],
      categories: [],
      inputValue: "",
      cartBusket: [],
      value: [0, 40] // we stopped here, slider
      // has a loading problem, need to deal with filter functionality
    };
  }

  componentDidMount() {
    const endPoint =
      "https://gist.githubusercontent.com/maratgaip/44060c688fcf5f2b7b3985a6d15fdb1d/raw/e93c3dce0826d08c8c6e779cb5e6d9512c8fdced/restaurant-menu.json";
    axios
      .get(endPoint)
      .then((items) => {
        const categoryData = ["all"];
        items.data.forEach((item) => {
          if (!categoryData.includes(item.category)) {
            categoryData.push(item.category);
          }
        });
        this.setState({
          data: items.data,
          filteredData: items.data,
          categories: categoryData
        });
      })

      .catch((error) => "The error is" + error);
  }

  handlerBtn = (e) => {
    const copyData = [...this.state.data];
    const name = e.target.name;
    if (name === "all") {
      this.setState({ filteredData: copyData });
    } else {
      const categoryData = copyData.filter((item) => item.category === name);
      this.setState({ filteredData: categoryData });
    }
  };

  handlerInput = (e) => {
    const nameOfMeal = e.target.value;
    const allMeals = [...this.state.data];
    const filtered = allMeals.filter((item) =>
      item.title.toLowerCase().includes(nameOfMeal.toLowerCase())
    );
    this.setState({ inputValue: nameOfMeal, filteredData: filtered });
  };

  addToCart = (index) => {
    console.log("im clicked");
    const { cartBusket, filteredData } = this.state;
    cartBusket.push(filteredData[index]);
    this.setState({ cartBusket: cartBusket });
  };
  deleteFromCart = (index) => {
    const { cartBusket } = this.state;
    cartBusket.splice(index, 1);
    this.setState({ cartBusket: cartBusket });
  };
  handleChangeSlider = (event) => {
    // setValue(newValue);
    const newValue = event.target.value;
    this.setState({ value: newValue });
  };
  render() {
    const {
      categories,
      filteredData,
      inputValue,
      cartBusket,
      value
    } = this.state;
    return (
      <div className="App">
        <div className="title">
          <h2>Our Menu</h2>
          <div className="underline"></div>
        </div>
        <Categories categoriesBtn={categories} handlerBtn={this.handlerBtn} />
        <div className="search-slider-wrapper">
          <SearchInput value={inputValue} handlerInput={this.handlerInput} />
          <RangeSlider
            value={value}
            handleChangeSlider={this.handleChangeSlider}
          />
        </div>
        <CartOffCanvas
          cartBusket={cartBusket}
          deleteFromCart={this.deleteFromCart}
        />
        {filteredData.length > 0 ? (
          <MainMenu addToCart={this.addToCart} getData={filteredData} />
        ) : (
          <h3 style={{ textAlign: "center", color: "red" }}>not found</h3>
        )}
      </div>
    );
  }
}

export default App;
