<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:output method="xml" indent="yes" />
	
	<xsl:template match="/*">
		<api>
			<class name="jQuery">
				<constructors>
					<xsl:for-each select="//function[@name='jQuery']">
						<constructor scope="instance">
							<description><xsl:value-of select="desc" /></description>
							<parameters>
								<xsl:for-each select="params">
									<parameter name="{@name}" datatype="{@type}">
										<xsl:attribute name="required">
											<xsl:choose>
												<xsl:when test="not(@optional)">true</xsl:when>
												<xsl:when test="@optional">false</xsl:when>
											</xsl:choose>
										</xsl:attribute>
										<description><xsl:value-of select="desc" /></description>
									</parameter>
								</xsl:for-each> 
							</parameters>
							<returnType datatype="{@return}" />
						</constructor>
					</xsl:for-each>
				</constructors>
				<properties>
					<xsl:for-each select="//property">
						<xsl:sort select="translate(@name,'$.','')"/>
						<xsl:sort select="count(params)"/>
						<property name="{@name}" readonly="true" datatype="{@return}">
							<xsl:attribute name="scope">
								<xsl:choose>
									<xsl:when test="starts-with(@name, 'jQuery.')">static</xsl:when>
									<xsl:when test="not(starts-with(@name, 'jQuery.'))">instance</xsl:when>
								</xsl:choose>
							</xsl:attribute>
							<description><xsl:value-of select="desc" /></description>
						</property>
					</xsl:for-each>
				</properties>
				<methods>
					<xsl:for-each select="//function[@name!='jQuery']">
						<xsl:sort select="translate(@name,'$.','')"/>
						<xsl:sort select="count(params)"/>
						<method name="{@name}">
							<xsl:attribute name="scope">
								<xsl:choose>
									<xsl:when test="starts-with(@name, 'jQuery.')">static</xsl:when>
									<xsl:when test="not(starts-with(@name, 'jQuery.'))">instance</xsl:when>
								</xsl:choose>
							</xsl:attribute>
							<description><xsl:value-of select="desc" /></description>
							<parameters>
								<xsl:for-each select="params">
									<parameter name="{@name}" datatype="{@type}">
										<xsl:attribute name="required">
											<xsl:choose>
												<xsl:when test="not(@optional)">true</xsl:when>
												<xsl:when test="@optional">false</xsl:when>
											</xsl:choose>
										</xsl:attribute>
										<description><xsl:value-of select="desc" /></description>
									</parameter>
								</xsl:for-each> 
							</parameters>
							<returnType datatype="{@return}" />
						</method>
					</xsl:for-each>
				</methods>
			</class>
		</api>
	</xsl:template>

</xsl:stylesheet>
