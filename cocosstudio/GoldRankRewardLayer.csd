<GameFile>
  <PropertyGroup Name="GoldRankRewardLayer" Type="Layer" ID="9e30db95-cf40-449b-b26e-df2804b609c3" Version="3.10.0.0" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="0" Speed="1.0000" />
      <ObjectData Name="Layer" Tag="473" ctype="GameLayerObjectData">
        <Size X="1280.0000" Y="720.0000" />
        <Children>
          <AbstractNodeData Name="block" ActionTag="889831995" Tag="629" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" TouchEnable="True" ClipAble="False" BackColorAlpha="204" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
            <Size X="1280.0000" Y="720.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="360.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="1.0000" Y="1.0000" />
            <SingleColor A="255" R="0" G="0" B="0" />
            <FirstColor A="255" R="150" G="200" B="255" />
            <EndColor A="255" R="255" G="255" B="255" />
            <ColorVector ScaleY="1.0000" />
          </AbstractNodeData>
          <AbstractNodeData Name="back" ActionTag="-102636464" Tag="385" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" TopMargin="-8.1760" BottomMargin="108.1760" LeftEage="256" RightEage="256" TopEage="190" BottomEage="190" Scale9OriginX="256" Scale9OriginY="190" Scale9Width="768" Scale9Height="240" ctype="ImageViewObjectData">
            <Size X="1280.0000" Y="620.0000" />
            <Children>
              <AbstractNodeData Name="closeBtn" ActionTag="401543253" Tag="384" IconVisible="False" LeftMargin="1077.0601" RightMargin="37.9399" TopMargin="109.0000" BottomMargin="349.0000" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="135" Scale9Height="140" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="165.0000" Y="162.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="1159.5601" Y="430.0000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.9059" Y="0.6935" />
                <PreSize X="0.1289" Y="0.2613" />
                <TextColor A="255" R="65" G="65" B="70" />
                <PressedFileData Type="Normal" Path="common/close_s2.png" Plist="" />
                <NormalFileData Type="Normal" Path="common/close2.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="titleImage" ActionTag="-1321407858" Tag="1493" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="500.0000" RightMargin="500.0000" TopMargin="81.5800" BottomMargin="458.4200" LeftEage="91" RightEage="91" TopEage="28" BottomEage="28" Scale9OriginX="91" Scale9OriginY="28" Scale9Width="98" Scale9Height="24" ctype="ImageViewObjectData">
                <Size X="280.0000" Y="80.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="498.4200" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="0.8039" />
                <PreSize X="0.2188" Y="0.1290" />
                <FileData Type="Normal" Path="game_picture/gold/rank/reward_title.png" Plist="" />
              </AbstractNodeData>
              <AbstractNodeData Name="rankAwardView1" ActionTag="147578087" Tag="387" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="183.4000" RightMargin="746.6000" TopMargin="184.6000" BottomMargin="85.4000" TouchEnable="True" ClipAble="False" BackColorAlpha="0" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="350.0000" Y="350.0000" />
                <Children>
                  <AbstractNodeData Name="rankImage" ActionTag="-1440763515" Tag="1510" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-2.5000" RightMargin="-2.5000" TopMargin="37.0600" BottomMargin="277.9400" LeftEage="15" RightEage="15" TopEage="15" BottomEage="15" Scale9OriginX="15" Scale9OriginY="15" Scale9Width="325" Scale9Height="5" ctype="ImageViewObjectData">
                    <Size X="355.0000" Y="35.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="295.4400" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8441" />
                    <PreSize X="1.0143" Y="0.1000" />
                    <FileData Type="Normal" Path="game_picture/gold/rank/reward_rank1.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="rankLabel" ActionTag="-261945999" Tag="674" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="15.0000" RightMargin="15.0000" TopMargin="83.4900" BottomMargin="178.5100" CharWidth="64" CharHeight="88" LabelText=".888/" StartChar="." ctype="TextAtlasObjectData">
                    <Size X="320.0000" Y="88.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="222.5100" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.6357" />
                    <PreSize X="0.9143" Y="0.2514" />
                    <LabelAtlasFileImage_CNB Type="Normal" Path="game_picture/gold/rank/reward_rankNum.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="rewardItem1" ActionTag="-291822848" Tag="1505" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="98.5000" RightMargin="98.5000" TopMargin="216.9300" BottomMargin="-20.9300" LeftEage="50" RightEage="50" TopEage="50" BottomEage="50" Scale9OriginX="50" Scale9OriginY="50" Scale9Width="53" Scale9Height="54" ctype="ImageViewObjectData">
                    <Size X="153.0000" Y="154.0000" />
                    <Children>
                      <AbstractNodeData Name="icon" ActionTag="-728853406" Tag="1502" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-7.0000" RightMargin="-7.0000" TopMargin="-5.5000" BottomMargin="-5.5000" LeftEage="46" RightEage="46" TopEage="46" BottomEage="46" Scale9OriginX="46" Scale9OriginY="46" Scale9Width="75" Scale9Height="73" ctype="ImageViewObjectData">
                        <Size X="167.0000" Y="165.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="76.5000" Y="77.0000" />
                        <Scale ScaleX="0.8000" ScaleY="0.8000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="1.0915" Y="1.0714" />
                        <FileData Type="Normal" Path="game_picture/gold/rank/reward_gold1.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="kuang2" ActionTag="1920016024" Tag="1503" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="12.0000" RightMargin="12.0000" TopMargin="113.3400" BottomMargin="8.6600" LeftEage="42" RightEage="42" TopEage="10" BottomEage="10" Scale9OriginX="42" Scale9OriginY="10" Scale9Width="45" Scale9Height="12" ctype="ImageViewObjectData">
                        <Size X="129.0000" Y="32.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="76.5000" Y="24.6600" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.1601" />
                        <PreSize X="0.8431" Y="0.2078" />
                        <FileData Type="Normal" Path="game_picture/gold/rank/reward_kuang2.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="name" ActionTag="1978338902" Tag="1504" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="37.5000" RightMargin="37.5000" TopMargin="117.8400" BottomMargin="13.1600" FontSize="20" LabelText="100元宝" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="78.0000" Y="23.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="76.5000" Y="24.6600" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="113" G="9" B="9" />
                        <PrePosition X="0.5000" Y="0.1601" />
                        <PreSize X="0.5098" Y="0.1494" />
                        <FontResource Type="Normal" Path="fonts/lanting.TTF" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="56.0700" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.1602" />
                    <PreSize X="0.4371" Y="0.4400" />
                    <FileData Type="Normal" Path="game_picture/gold/rank/reward_kuang.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="rewardImage" ActionTag="-1732188090" Tag="1499" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="146.5000" RightMargin="146.5000" TopMargin="183.6000" BottomMargin="137.4000" LeftEage="18" RightEage="18" TopEage="9" BottomEage="9" Scale9OriginX="18" Scale9OriginY="9" Scale9Width="21" Scale9Height="11" ctype="ImageViewObjectData">
                    <Size X="57.0000" Y="29.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="151.9000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.4340" />
                    <PreSize X="0.1629" Y="0.0829" />
                    <FileData Type="Normal" Path="game_picture/gold/rank/reward.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="358.4000" Y="260.4000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.2800" Y="0.4200" />
                <PreSize X="0.2734" Y="0.5645" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="rankAwardView2" ActionTag="1009259846" Tag="253" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="746.6000" RightMargin="183.3999" TopMargin="184.6000" BottomMargin="85.4000" TouchEnable="True" ClipAble="False" BackColorAlpha="0" ComboBoxIndex="1" ColorAngle="90.0000" Scale9Width="1" Scale9Height="1" ctype="PanelObjectData">
                <Size X="350.0000" Y="350.0000" />
                <Children>
                  <AbstractNodeData Name="rankImage" ActionTag="-715093452" Tag="254" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="-2.5000" RightMargin="-2.5000" TopMargin="37.0600" BottomMargin="277.9400" LeftEage="15" RightEage="15" TopEage="15" BottomEage="15" Scale9OriginX="15" Scale9OriginY="15" Scale9Width="325" Scale9Height="5" ctype="ImageViewObjectData">
                    <Size X="355.0000" Y="35.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="295.4400" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.8441" />
                    <PreSize X="1.0143" Y="0.1000" />
                    <FileData Type="Normal" Path="game_picture/gold/rank/reward_rank2.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="rankLabel" ActionTag="12026157" Tag="255" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="15.0000" RightMargin="15.0000" TopMargin="83.4900" BottomMargin="178.5100" CharWidth="64" CharHeight="88" LabelText=".888/" StartChar="." ctype="TextAtlasObjectData">
                    <Size X="320.0000" Y="88.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="222.5100" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.6357" />
                    <PreSize X="0.9143" Y="0.2514" />
                    <LabelAtlasFileImage_CNB Type="Normal" Path="game_picture/gold/rank/reward_rankNum.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="rewardItem1" ActionTag="-1585780858" Tag="256" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="98.5000" RightMargin="98.5000" TopMargin="216.9300" BottomMargin="-20.9300" LeftEage="50" RightEage="50" TopEage="50" BottomEage="50" Scale9OriginX="50" Scale9OriginY="50" Scale9Width="53" Scale9Height="54" ctype="ImageViewObjectData">
                    <Size X="153.0000" Y="154.0000" />
                    <Children>
                      <AbstractNodeData Name="icon" ActionTag="1978999515" Tag="257" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="-7.0000" RightMargin="-7.0000" TopMargin="-5.5000" BottomMargin="-5.5000" LeftEage="46" RightEage="46" TopEage="46" BottomEage="46" Scale9OriginX="46" Scale9OriginY="46" Scale9Width="75" Scale9Height="73" ctype="ImageViewObjectData">
                        <Size X="167.0000" Y="165.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="76.5000" Y="77.0000" />
                        <Scale ScaleX="0.8000" ScaleY="0.8000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.5000" />
                        <PreSize X="1.0915" Y="1.0714" />
                        <FileData Type="Normal" Path="game_picture/gold/rank/reward_gold1.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="kuang2" ActionTag="-193419945" Tag="258" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="12.0000" RightMargin="12.0000" TopMargin="113.3400" BottomMargin="8.6600" LeftEage="42" RightEage="42" TopEage="10" BottomEage="10" Scale9OriginX="42" Scale9OriginY="10" Scale9Width="45" Scale9Height="12" ctype="ImageViewObjectData">
                        <Size X="129.0000" Y="32.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="76.5000" Y="24.6600" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="255" G="255" B="255" />
                        <PrePosition X="0.5000" Y="0.1601" />
                        <PreSize X="0.8431" Y="0.2078" />
                        <FileData Type="Normal" Path="game_picture/gold/rank/reward_kuang2.png" Plist="" />
                      </AbstractNodeData>
                      <AbstractNodeData Name="name" ActionTag="-1481561117" Tag="259" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="37.5000" RightMargin="37.5000" TopMargin="117.8400" BottomMargin="13.1600" FontSize="20" LabelText="100元宝" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                        <Size X="78.0000" Y="23.0000" />
                        <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                        <Position X="76.5000" Y="24.6600" />
                        <Scale ScaleX="1.0000" ScaleY="1.0000" />
                        <CColor A="255" R="113" G="9" B="9" />
                        <PrePosition X="0.5000" Y="0.1601" />
                        <PreSize X="0.5098" Y="0.1494" />
                        <FontResource Type="Normal" Path="fonts/lanting.TTF" Plist="" />
                        <OutlineColor A="255" R="255" G="0" B="0" />
                        <ShadowColor A="255" R="110" G="110" B="110" />
                      </AbstractNodeData>
                    </Children>
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="56.0700" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.1602" />
                    <PreSize X="0.4371" Y="0.4400" />
                    <FileData Type="Normal" Path="game_picture/gold/rank/reward_kuang.png" Plist="" />
                  </AbstractNodeData>
                  <AbstractNodeData Name="rewardImage" ActionTag="1229833932" Tag="260" IconVisible="False" PositionPercentXEnabled="True" PositionPercentYEnabled="True" LeftMargin="146.5000" RightMargin="146.5000" TopMargin="183.6000" BottomMargin="137.4000" LeftEage="18" RightEage="18" TopEage="9" BottomEage="9" Scale9OriginX="18" Scale9OriginY="9" Scale9Width="21" Scale9Height="11" ctype="ImageViewObjectData">
                    <Size X="57.0000" Y="29.0000" />
                    <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                    <Position X="175.0000" Y="151.9000" />
                    <Scale ScaleX="1.0000" ScaleY="1.0000" />
                    <CColor A="255" R="255" G="255" B="255" />
                    <PrePosition X="0.5000" Y="0.4340" />
                    <PreSize X="0.1629" Y="0.0829" />
                    <FileData Type="Normal" Path="game_picture/gold/rank/reward.png" Plist="" />
                  </AbstractNodeData>
                </Children>
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="921.6000" Y="260.4000" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.7200" Y="0.4200" />
                <PreSize X="0.2734" Y="0.5645" />
                <SingleColor A="255" R="150" G="200" B="255" />
                <FirstColor A="255" R="150" G="200" B="255" />
                <EndColor A="255" R="255" G="255" B="255" />
                <ColorVector ScaleY="1.0000" />
              </AbstractNodeData>
              <AbstractNodeData Name="tipLabel" ActionTag="1949676367" Tag="1496" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="499.5000" RightMargin="499.5000" TopMargin="576.9800" BottomMargin="13.0200" FontSize="26" LabelText="  分享游戏立即领取奖励  " ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="TextObjectData">
                <Size X="281.0000" Y="30.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="28.0200" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="84" G="77" B="41" />
                <PrePosition X="0.5000" Y="0.0452" />
                <PreSize X="0.2195" Y="0.0484" />
                <FontResource Type="Normal" Path="fonts/lanting.TTF" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
              <AbstractNodeData Name="shareGetBtn" ActionTag="-1559595885" Tag="1494" IconVisible="False" PositionPercentXEnabled="True" LeftMargin="530.5000" RightMargin="530.5000" TopMargin="630.0900" BottomMargin="-81.0900" TouchEnable="True" FontSize="14" Scale9Enable="True" LeftEage="15" RightEage="15" TopEage="11" BottomEage="11" Scale9OriginX="15" Scale9OriginY="11" Scale9Width="189" Scale9Height="49" ShadowOffsetX="2.0000" ShadowOffsetY="-2.0000" ctype="ButtonObjectData">
                <Size X="219.0000" Y="71.0000" />
                <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
                <Position X="640.0000" Y="-45.5900" />
                <Scale ScaleX="1.0000" ScaleY="1.0000" />
                <CColor A="255" R="255" G="255" B="255" />
                <PrePosition X="0.5000" Y="-0.0735" />
                <PreSize X="0.1711" Y="0.1145" />
                <TextColor A="255" R="65" G="65" B="70" />
                <PressedFileData Type="Normal" Path="game_picture/gold/rank/reward_shareGet2.png" Plist="" />
                <NormalFileData Type="Normal" Path="game_picture/gold/rank/reward_shareGet.png" Plist="" />
                <OutlineColor A="255" R="255" G="0" B="0" />
                <ShadowColor A="255" R="110" G="110" B="110" />
              </AbstractNodeData>
            </Children>
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="640.0000" Y="418.1760" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5808" />
            <PreSize X="1.0000" Y="0.8611" />
            <FileData Type="Normal" Path="game_picture/gold/rank/reward_bg.png" Plist="" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameFile>