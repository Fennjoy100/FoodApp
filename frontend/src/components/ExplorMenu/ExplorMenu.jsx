import React from 'react'
import './ExplorMenu.css'
import { menu_list } from '../../assets/assets'

const ExplorMenu = ({ category, setCategory }) => {
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>

      <p className='explore-menu-text'>
        mollitia voluptas, iusto illo nostrum explicabo eveniet, sit ipsum iste id.
        Excepturi debitis aliquid quas eveniet suscipit eaque recusandae odit nobis
        ducimus sequi? Tempora, labore expedita.
      </p>

      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              key={index}
              className="explore-menu-list-item"
              onClick={() =>
                setCategory(
                  category === item.menu_name
                    ? "All"
                    : item.menu_name
                )
              }
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt={item.menu_name}
              />

              <p>{item.menu_name}</p>
            </div>
          )
        })}
      </div>

      <hr />
    </div>
  )
}

export default ExplorMenu
