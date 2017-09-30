    <ul class="pagination">

            <% if(prev) { %>
                <li><a href="1" class="event-page-change"><i class="zmdi zmdi-undo"></i></a></li>
                <li><a href="<%= currentPage-1 %>" class="page event-page-change">&lt;</a></li>
            <% } %>
            <% if(currentPage < 3) {%>
                <% if(totalPages >= 3) { %>
                    <% _.each(_.range(3),function(threePages){ %>
                        <li <% if(currentPage == threePages+1) { %> class="active" <% } %> ><a  href="<%= threePages+1 %>" class="page event-page-change"><%= threePages+1 %></a></li>
                    <% })  %>
                <% } else {  %>
                    <% _.each(_.range(totalPages),function(threePages){ %>
                        <li <% if(currentPage == threePages+1) { %> class="active" <% } %> ><a  href="<%= threePages+1 %>" class="page event-page-change"><%= threePages+1 %></a></li>
                    <% })  %>
                <% } %>
            <% } else { %>
                <% _.each([2,1],function(firstThree){ %>
                    <li><a href="<%= currentPage-firstThree %>" class="page event-page-change"><%= currentPage-firstThree %></a></li>
                <% })  %>

                <li class="active"><a href="<%= currentPage %>" class="page event-page-change"><%= currentPage %></a></li>

                <% if(totalPages > currentPage) {%>
                    <% if(totalPages - 1 == currentPage) { %>
                        <% _.each(_.range(totalPages-currentPage),function(lastThree){ %>
                        <li><a href="<%= currentPage+(lastThree+1) %>" class="page event-page-change"><%= currentPage+(lastThree+1) %></a></li>
                    <% }) %>
                    <% } else {  %>
                        <% _.each(_.range(2),function(lastThree){ %>
                        <li><a href="<%= currentPage+(lastThree+1) %>" class="page event-page-change"><%= currentPage+(lastThree+1) %></a></li>
                        <% })  %>
                    <% } %>
                <% } %>
            <% } %>
            <% if(next) { %>
                <li><a href="<%= currentPage+1 %>" class="page event-page-change">&gt;</a></li>
            <% } %>

    </ul>