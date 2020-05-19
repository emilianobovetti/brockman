import React from 'react';

export function FeedEntry({ title, link }) {
  return (
    <a href={link} target="_blank">{title}</a>
  );
}
