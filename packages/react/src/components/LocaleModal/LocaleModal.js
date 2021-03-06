/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { settings as ddsSettings, altlangs } from '@carbon/ibmdotcom-utilities';
import { settings } from 'carbon-components';
import LocaleModalRegions from './LocaleModalRegions';
import LocaleModalCountries from './LocaleModalCountries';
import { ArrowLeft20, Globe20 } from '@carbon/icons-react';
import { ComposedModal, ModalHeader, ModalBody } from 'carbon-components-react';
import { LocaleAPI } from '@carbon/ibmdotcom-services';

import cx from 'classnames';

const { stablePrefix } = ddsSettings;
const { prefix } = settings;

/**
 * LocaleModal component
 *
 * @param {object} props props object
 * @param {boolean} props.isOpen Opens modal
 * @param {boolean} props.setIsOpen isOpen state of modal
 * @param {string} props.headerTitle modal header title
 * @returns {*} LocaleModal component
 */
const LocaleModal = ({ isOpen, setIsOpen, ...localeModalProps }) => {
  const [list, setList] = useState({});
  const [langDisplay, setLangDisplay] = useState();
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentRegion, setCurrentRegion] = useState();

  const filterClass = cx({
    [`${prefix}--locale-modal__filtering`]: isFiltering,
  });

  useEffect(() => {
    (async () => {
      const locale = await LocaleAPI.getLocale();
      const list = locale && (await LocaleAPI.getList(locale));
      const getLangDisplay = await LocaleAPI.getLangDisplay();
      setLangDisplay(getLangDisplay);
      setList(list);
    })();
  }, []);

  /**
   *  New region/country list based lang attributes available on page
   *
   * @param {object} list country list
   *
   * @returns {object} list item
   */
  const sortList = list => {
    const pageLangs = altlangs();
    const filterList = [];

    list.regionList &&
      list.regionList.map((region, index) => {
        filterList.push({
          name: region.name,
          key: region.key,
          countries: [],
        });

        for (let [key, value] of Object.entries(pageLangs)) {
          region.countryList.map(country => {
            country.locale.map(loc => {
              if (loc[0].includes(key)) {
                filterList[index].countries.push({
                  region: region.key,
                  name: country.name,
                  locale: loc[0],
                  language: loc[1],
                  href: value,
                });
              }
            });
          });
        }

        filterList[index].countries.sort((a, b) => (a.name > b.name ? 1 : -1));
      });

    return filterList;
  };

  return (
    <ComposedModal
      open={isOpen}
      onClose={close}
      data-autoid={`${stablePrefix}--locale-modal`}>
      {isFiltering ? (
        <ModalHeader
          data-autoid={`${stablePrefix}--locale-modal__region-back`}
          label={[
            <ArrowLeft20 className={`${prefix}--locale-modal__label-arrow`} />,
            localeModalProps.headerTitle,
          ]}
          title={currentRegion}
          className={`${prefix}--locale-modal__back`}
        />
      ) : (
        <ModalHeader
          label={[
            langDisplay,
            <Globe20 className={`${prefix}--locale-modal__label-globe`} />,
          ]}
          title={localeModalProps.headerTitle}
        />
      )}
      <ModalBody className={`${prefix}--locale-modal ${filterClass}`}>
        <LocaleModalRegions
          regionList={sortList(list)}
          setCurrentRegion={setCurrentRegion}
          setIsFiltering={setIsFiltering}
          {...localeModalProps}
        />
        <LocaleModalCountries
          regionList={sortList(list)}
          setIsFiltering={setIsFiltering}
          {...localeModalProps}
        />
      </ModalBody>
    </ComposedModal>
  );

  /**
   * Sets modal state to closed
   *
   * @private
   */
  function close() {
    setIsOpen(false);
  }
};

/**
 * @property propTypes
 * @description Defined property types for component
 * @type {{isOpen: boolean, setIsOpen: boolean, headerLabel: string, headerTitle: string}}
 */
LocaleModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.bool,
  headerLabel: PropTypes.string,
  headerTitle: PropTypes.string,
};

/**
 * @property defaultProps
 * @type {{availabilityText: string, unavailabilityText: string, placeHolderText: string, labelText: string}}
 */
LocaleModal.defaultProps = {
  headerTitle: 'Select region',
  availabilityText:
    'This page is available in the following locations and languages',
  unavailabilityText:
    'This page is unavailable in your preferred location or language',
};

export default LocaleModal;
