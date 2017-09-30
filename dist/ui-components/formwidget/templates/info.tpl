<h4 class="m-t-5 m-r-10 p-t-0 pull-left"><%=i18n.trans("Current settings")%></h4>
<ul class="wall-attrs clearfix list-inline list-unstyled">
    <li class="wa-stats">
        <%if(advertiser){%>
            <span class="c-blue" data-toggle="tooltip" data-placement="top" title=""
                  data-original-title="<%=i18n.trans('Advertisers')%>"><i class="zmdi zmdi-case"></i>
                <a><%-advertiser.name%></a>
            </span>
        <%}%>
        <span class="c-bluegray" data-toggle="tooltip" data-placement="top" title=""
              data-original-title="<%=i18n.trans('Broadcasting time')%>">
            <i class="zmdi zmdi-calendar"></i> <%-start%> - <%-end%>
        </span>
         <span class="c-gray" data-toggle="tooltip" data-placement="top" title=""
               data-original-title="<%=i18n.trans('Display orientation')%>">
            <i class="zmdi zmdi-screen-rotation"></i>
             <%if(orientation == "landscape"){%>
                <%=i18n.trans("Landscape")%>
             <%}else{%>
                <%=i18n.trans("Portrait")%>
             <%}%>
        </span>
        <%if(usedDuration){%>
            <span class="c-blue" data-toggle="tooltip" data-placement="top" title=""
                  data-original-title="<%=i18n.trans('Duration')%>">
                <i class="zmdi zmdi-time-interval"></i> <%- _th.duration(usedDuration)%>
            </span>
        <%}%>
    </li>
</ul>
<button class="btn btn-primary btn-float event-step-settings"><i class="zmdi zmdi-edit"></i></button>