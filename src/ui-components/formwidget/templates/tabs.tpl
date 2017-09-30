<% _.each(steps, function(value, key, list){%>
    <li <%if(currentStep == key){%>class="active"<%}%>>
        <a href="#" class="event-widget-step <%if(!list[key].allow){%>c-gray not-allowed<%}%>"
           data-step="<%=key%>">
            <%-Object.keys(list).indexOf(key) + 1%>. <%= list[key].name %>
        </a>
    </li>
<%});%>