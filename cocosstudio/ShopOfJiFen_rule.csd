<GameFile>
  <PropertyGroup Name="ShopOfJiFen_rule" Type="Layer" ID="78c31ab4-1ec1-445c-aab2-e98bae10846a" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="44" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="block" CanEdit="False" ActionTag="1311376693" Tag="119" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="153" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="0" G="0" B="0" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="back" ActionTag="-951350627" Tag="58" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" TopMargin="-1.4399" BottomMargin="1.4400" ClipAble="False" BackColorAlpha="0" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <Children>
              <AbstractNodeData Name="bg" ActionTag="1692587304" Tag="116" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" TopMargin="10.8000" BottomMargin="-10.8000" LeftEage="169" RightEage="169" TopEage="141" BottomEage="141" Scale9OriginX="169" Scale9OriginY="141" Scale9Width="942" Scale9Height="438" ctype="ImageViewObjectData">
                <Size X="1280.0000" Y="720.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="349.2000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.4850" />
                <PreSize X="1.0000" Y="1.0000" />
                <FileData Type="Normal" Path="ShopOfJiFen/bg_tanchuang.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="Image_2" ActionTag="-448192057" Tag="439" IconVisible="False" LeftMargin="577.2650" RightMargin="570.7350" TopMargin="102.1438" BottomMargin="586.8562" LeftEage="43" RightEage="43" TopEage="10" BottomEage="10" Scale9OriginX="43" Scale9OriginY="10" Scale9Width="46" Scale9Height="11" ctype="ImageViewObjectData">
                <Size X="132.0000" Y="31.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="643.2650" Y="602.3562" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5026" Y="0.8366" />
                <PreSize X="0.1031" Y="0.0431" />
                <FileData Type="Normal" Path="ShopOfJiFen/title_rule.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="close" ActionTag="-1382836787" Tag="787" IconVisible="False" LeftMargin="1008.9730" RightMargin="213.0270" TopMargin="106.1810" BottomMargin="555.8190" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="28" Scale9Height="36" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="58.0000" Y="58.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="1037.9730" Y="584.8190" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.8109" Y="0.8122" />
                <PreSize X="0.0453" Y="0.0806" />
                <TextColor A="255" R="65" G="65" B="70" />
                <NormalFileData Type="Normal" Path="ShopOfJiFen/btn_close.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="contentScrollView" ActionTag="-1527523882" Tag="50" IconVisible="False" LeftMargin="224.2953" RightMargin="205.7046" TopMargin="159.9684" BottomMargin="110.0316" TouchEnable="True" ClipAble="True" BackColorAlpha="0" ComboBoxIndex="1" ColorAngle="90.0000" IsBounceEnabled="True" ScrollDirectionType="0" DirectionType="Vertical" ctype="ListViewObjectData">
                <Size X="850.0000" Y="450.0000" />
                <Children>
                  <AbstractNodeData Name="title1" ActionTag="1999059444" Tag="51" IconVisible="False" BottomMargin="430.0000" IsCustomSize="True" FontSize="18" LabelText="总则：&#xA;①　完成每日任务后需手动领取礼券，未领取的礼券将于每日0点清零，总礼券可累加。&#xA;②　所有商品兑换成功后无法退换。&#xA;③　实物商品将于兑换成功后7个工作日内发货，（如遇节假日将顺延），礼券奖励即时到账。&#xA;④　一经购买，不支持退货，商品如若质量问题请联系客服登记换货。&#xA;⑤　请如实填写收货地址以及联系电话，确保能正常收货。" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                    <Size X="850.0000" Y="20.0000" />
                    <AnchorPoint ScaleX="1.0000" ScaleY="1.0000" />
                    <Position X="850.0000" Y="450.0000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="124" G="40" B="27" />
                    <PrePosition X="1.0000" Y="1.0000" />
                    <PreSize X="1.0000" Y="0.0444" />
                    <FontResource Type="Normal" Path="fonts/lanting.TTF" Plist="" />
                    <OutlineColor A="255" R="255" G="0" B="0" />
                    <ShadowColor A="255" R="110" G="110" B="110" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint />
                <Position X="224.2953" Y="110.0316" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.1752" Y="0.1528" />
                <PreSize X="0.6641" Y="0.6250" />
                <SingleColor A="255" R="150" G="150" B="255" />
                <FirstColor A="255" R="150" G="150" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="tipText" ActionTag="1854075163" Tag="378" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="226.8040" RightMargin="254.1960" TopMargin="622.6241" BottomMargin="73.3759" FontSize="20" LabelText="活动一切解释权归XX棋牌所有，如有疑问请点击游戏主页的“咨询”联系客服进行咨询。    " HorizontalAlignmentType="HT_Center" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="799.0000" Y="24.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="626.3040" Y="85.3759" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="124" G="40" B="27" />
                <PrePosition X="0.4893" Y="0.1186" />
                <PreSize X="0.6242" Y="0.0333" />
                <FontResource Type="Normal" Path="fonts/lanting.TTF" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="361.4400" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5020" />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>