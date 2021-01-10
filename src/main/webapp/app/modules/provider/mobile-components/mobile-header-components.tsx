import './header.scss';

import React from 'react';
import { Translate } from 'react-jhipster';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { Avatar } from '../../../shared/layout/header/avatar';
import 'lazysizes';
// tslint:disable-next-line:no-submodule-imports
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NavDropdown = props => (
  <UncontrolledDropdown inNavbar id={props.id}>
    <DropdownToggle nav caret className="d-flex align-items-center">
      <div className="self-align-center">
        <Avatar size="small" name={`${props.name.charAt(0).toUpperCase()}`} avatarBase64={props.avatarBase64} />
      </div>
      <span className="navbar-label">{props.name}</span>
    </DropdownToggle>
    <DropdownMenu right style={props.style}>
      {props.children}
    </DropdownMenu>
  </UncontrolledDropdown>
);

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img data-src="content/images/benetech-logo.png" className="lazyload" alt="Logo" />
  </div>
);

export const Brand = props => (
  <div className="d-flex align-items-center brand-menu">
    <NavbarBrand tag={Link} to={props.isSacramento ? '/shelters' : '/'} className="brand-logo d-flex align-items-center mr-1">
      <BrandIcon />
    </NavbarBrand>
    <NavLink exact tag={Link} to="/provider-home" className="pl-0">
      <span className="navbar-label text-dark header-link">
        <Translate contentKey="global.menu.home" />
      </span>
    </NavLink>
    <NavLink exact tag={Link} to="/feedback" className="pl-0">
      <span className="navbar-label text-dark header-link">
        <Translate contentKey="global.menu.feedback" />
      </span>
    </NavLink>
  </div>
);
