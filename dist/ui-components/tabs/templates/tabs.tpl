<% _.each(tabs, function(value, key){%>
    <li <%if(currentTab == key){%>class="active"<%}%>>
        <a href="#" class="event-tab-show" data-tab="<%=key%>">
            <%= value.name %>
        </a>
    </li>
<%});%>