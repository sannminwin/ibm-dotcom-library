/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { settings as ddsSettings } from '@carbon/ibmdotcom-utilities';
import { settings } from 'carbon-components';
import { CardLink } from '@carbon/ibmdotcom-react';
import { ArrowRight20 } from '@carbon/icons-react';

const { stablePrefix } = ddsSettings;
const { prefix } = settings;

/**
 * Card without images group Component
 *
 * @param {object} props props object
 * @param {string} props.title cards group title
 * @param {Array} props.groupCard cards group card
 * @param {Array} props.cards Array of object with title, href and target properties
 * @returns {object} JSX Object
 */
const CardsWithoutImagesGroup = ({ title, groupCard, cards }) => {
  return (
    <div
      data-autoid={`${stablePrefix}--cards-without-images-group`}
      className={`${prefix}--cards-without-images-group`}>
      <h2 className={`${prefix}--cards-without-images-group__title`}>
        {title}
      </h2>
      <div className={`${prefix}--cards-without-images-group__cards`}>
        {_renderList(cards)}
        <CardLink
          data-autoid={`${stablePrefix}--cards-without-images-group__cards__card-${groupCard.text}`}
          className={`${prefix}--cards-without-images-group__cards__card`}
          title={groupCard.text}
          href={groupCard.href}
          target={groupCard.target}
          icon={<ArrowRight20 />}
        />
      </div>
    </div>
  );
};

/**
 * Render List Component
 *
 * @private
 * @param {object} cards cards Object
 * @returns {object} JSX Object
 */
const _renderList = cards => {
  return cards.map(card => {
    return (
      <CardLink
        className={`${prefix}--cards-without-images-group__cards__card`}
        data-autoid={`${stablePrefix}--cards-without-images-group__card-${card.title}`}
        key={card.title}
        title={card.title}
        content={card.copy}
        href={card.link.href}
        target={card.link.target}
        icon={<ArrowRight20 />}
      />
    );
  });
};

CardsWithoutImagesGroup.propTypes = {
  title: PropTypes.string,
  groupCard: PropTypes.shape({
    href: PropTypes.string,
    text: PropTypes.string,
    target: PropTypes.string,
  }),
  cards: PropTypes.array,
};

export default CardsWithoutImagesGroup;