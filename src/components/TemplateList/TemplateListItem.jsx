import { shape, string } from 'prop-types';
import React from 'react';
import './TemplateListItem.css';

const TemplateListItem = (props) => {
  const { legacyId, name, thumbnailUrl } = props.template;
  const previewUrl = `https://my.leadpages.net/marketplace/template/${legacyId}/${legacyId}/preview/html/`;
  return (
    <div className="template-list-item">
      <a
        href={previewUrl}
        target="_blank"
        className="image-container"
        style={{ backgroundImage: `url('${thumbnailUrl}')` }}
      >
        <img src={thumbnailUrl} className="thumbnail-image" alt={`${name} thumbnail`} />
      </a>
      <p className="text-truncate mt-3">{name}</p>
    </div>
  );
};

TemplateListItem.propTypes = {
  template: shape({
    name: string.isRequired,
    legacyId: string.isRequired,
    thumbnailUrl: string.isRequired,
  }).isRequired,
};

export default TemplateListItem;
