import React, { Component } from 'react'
import axios from 'axios'
import * as geocoderStyles from '../../styles/modules/geocoder.module.less'

/* Simple Geocoder using the Census API
 * If this.props.returnFunc exists, call it with the result of the query
 */

export default class Geocoder extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchVal: '',
      searching: false,
      results: {
        result: null,
      },
    }
  }

  sendResults(coords) {
    if (this.props.resultFunc) {
      this.props.resultFunc(coords)
    }
    // Clear results on click
    this.setState({
      results: {
        result: null,
      },
    })
  }

  onKeyPress(e) {
    // Clear results on key press
    this.setState({
      results: {
        result: null,
      },
    })

    if (e.key === 'Enter') {
      this.searchAddress()
    }
  }

  searchAddress() {
    if (this.state.searching === false) {
      let geocodeURL = 'https://projects.sfchronicle.com/feeds/geocode/'
      this.setState({
        searching: true,
      })

      // UNCOMMENT THIS SET STATE TO WORK WITH A TEST RESULT
      /*
      this.setState({
        results: {
          "result": {
            "addressMatches": [
              {
                "matchedAddress": "901 MISSION TEST TEST TEST",
                "coordinates": {
                  "x": -122.4066217,
                  "y": 37.7822158
                },
              }
            ]
          }
        }
      });
      */

      // NOTE: This will fail on localhost for CORS reasons, trust it to work on the server
      axios.post(geocodeURL, { query: this.state.searchVal }).then((result) => {
        this.setState({
          results: result.data,
          searching: false,
        })
      })
    }
  }

  render() {
    // Check for validity of data
    let validAddresses = null
    try {
      validAddresses = this.state.results.result.addressMatches
    } catch (err) {
      // This is ok, it just means endpoint was not available
      if (this.state.results.result !== null) {
        validAddresses = false
      }
    }

    return (
      <div className={geocoderStyles.wrapper}>
        <div className={geocoderStyles.addressInput}>
          <input
            type="address"
            value={this.state.searchVal}
            onKeyPress={this.onKeyPress.bind(this)}
            placeholder="901 Mission St, San Francisco"
            onChange={(e) => {
              this.setState({
                searchVal: e.currentTarget.value,
              })
            }}
          />
          <button type="button" onClick={this.searchAddress.bind(this)}>
            {!this.state.searching ? (
              <span>Search</span>
            ) : (
              <img src="https://projects.sfchronicle.com/shared/logos/spinner.gif" />
            )}
          </button>
        </div>
        {validAddresses === false && (
          <div className={geocoderStyles.resultBox}>
            <div className={`${geocoderStyles.result} ${geocoderStyles.empty}`}>
              Something went wrong, please try again later
            </div>
          </div>
        )}
        {validAddresses && validAddresses.length === 0 && (
          <div className={geocoderStyles.resultBox}>
            <div className={`${geocoderStyles.result} ${geocoderStyles.empty}`}>
              No matches, please add more detail
            </div>
          </div>
        )}
        {validAddresses && validAddresses.length > 0 && (
          <div className={geocoderStyles.resultBox}>
            {this.state.results.result.addressMatches.map((item, index) => {
              return (
                <div
                  className={geocoderStyles.result}
                  onClick={() => this.sendResults(item.coordinates)}
                >
                  {item.matchedAddress}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}
