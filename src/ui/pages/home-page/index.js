import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import {
  fetchProducts,
  fetchAccountInfo,
  fetchFeeComputer } from '../../services/http';

import { promisifySetState } from '../../utils';

import Dropdown from '../../components/dropdown';
import RangeControl from '../../components/range-control';
import Card from '../../components/card';
import AccountInfo from '../../components/account-info';
import FeeComputer from '../../components/fee-computer';
import SwitchSelector from '../../components/switch-selector';
import Button from '../../components/button';
import './home-page.scss';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedProductId: null,
      accountInfo: null,
      fraction: 0,
      feeComputer: {
        fee: 0,
        remainder: 0,
        usd: 0
      }
    }
    this.onProductChange = this.onProductChange.bind(this);
    this.onChangeAccountFraction = this.onChangeAccountFraction.bind(this);
    this.setState = this.setState.bind(this);
    this.setNewState = promisifySetState(this.setState);
  }

  async componentDidMount() {
    this.updateProductsInState();
  }

  async updateProductsInState() {
    const products = await fetchProducts();
    this.setNewState({
      products: products.map(product =>
        ({ id: product.id, label: product.id })
      ) 
    });
  }

  async updateAccountInfoInState(productId) {
    const accountInfo = await fetchAccountInfo(productId);
    await this.setNewState({ accountInfo });
  }

  async updateFractionInState(fraction) {
    await this.setNewState({ fraction });
  }

  async updateFeeComputerInState() {
    const { fraction } = this.state;
    const feeComputer = await fetchFeeComputer(fraction);
    await this.setNewState({ feeComputer });
  }

  async updateSelectedProductIdInState(productId) {
    await this.setNewState({ selectedProductId: productId });
  }

  async onProductChange(productId) {
    await this.updateSelectedProductIdInState(productId);
    await this.updateAccountInfoInState(productId);
    await this.updateFeeComputerInState();
  }

  async onChangeAccountFraction(fraction) {
    await this.updateFractionInState(fraction);
    await this.updateFeeComputerInState();
  }

  render() {
    const { products, accountInfo, feeComputer } = this.state;
    const { fee, remainder, usd } = feeComputer;
    return (
      <div className="home-page-container">
        <section className="home-page-section">
          <Dropdown
            label="Selected Product"
            placeholder="Choose a product"
            items={products}
            onChange={this.onProductChange}
          />
        </section>
        {accountInfo && <section className="home-page-section">
          <Card label="Account Info">
            <AccountInfo account={accountInfo} />
          </Card>
        </section>}
        <section className="home-page-section">
          <Card label="Account Fraction">
            <RangeControl increments={0.05} onChange={debounce(this.onChangeAccountFraction, 400)} />
            <FeeComputer fee={+fee.toFixed(2)} total={+usd.toFixed(2)} remainder={+remainder.toFixed(2)} />
          </Card>
        </section>
        <section className="home-page-section">
          <Card label="Market Actions">
            <div className="home-page-buttons-container">
              <section className="home-page-buttons-order-type-section">
                <SwitchSelector
                    options={[
                      {id: 'market', label: 'Market'},
                      {id: 'limit', label: 'Limit'}
                    ]}
                />
              </section>
              <section className="home-page-buttons-execute-section">
                <Button hexColor="#090" label="Buy" />
                <Button hexColor="#900" label="Sell" />
              </section>
            </div>
          </Card>
        </section>
      </div>
    );
  }

}

HomePage.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  onProductChange: PropTypes.func
}

export default HomePage;