<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:output method="xml" indent="yes" />
	
	<!-- TODO convert @type array notation to bracket notation, eg. Array<DOMElement> to [DOMElement] -->
	<xsl:template match="/*">
		<api>
			<class name="jQuery">
				<constructors>
					<xsl:for-each select="//function[@name='jQuery']">
						<constructor scope="instance">
							<shortDescription><xsl:value-of select="desc" /></shortDescription>
							<description><xsl:value-of select="longdesc" /></description>
							<xsl:call-template name="parameters" />
							<returnType datatype="{@return}" />
							<xsl:call-template name="examples" />
						</constructor>
					</xsl:for-each>
				</constructors>
				<fields>
					<xsl:for-each select="//property">
						<xsl:sort select="translate(@name,'$.','')"/>
						<xsl:sort select="count(params)"/>
						<field name="{@name}" readonly="true" datatype="{@return}">
							<xsl:call-template name="scope" />
							<shortDescription><xsl:value-of select="desc" /></shortDescription>
							<description><xsl:value-of select="longdesc" /></description>
							<xsl:call-template name="examples" />
						</field>
					</xsl:for-each>
				</fields>
				<methods>
					<xsl:for-each select="//function[@name!='jQuery']">
						<xsl:sort select="translate(@name,'$.','')"/>
						<xsl:sort select="count(params)"/>
						<method name="{@name}">
							<xsl:call-template name="scope" />
							<shortDescription><xsl:value-of select="desc" /></shortDescription>
							<description><xsl:value-of select="longdesc" /></description>
							<xsl:call-template name="parameters" />
							<returnType datatype="{@return}" />
							<xsl:call-template name="examples" />
						</method>
					</xsl:for-each>
				</methods>
			</class>
		</api>
	</xsl:template>
	
	<xsl:template name="scope">
		<xsl:attribute name="scope">
			<xsl:choose>
				<xsl:when test="starts-with(@name, 'jQuery.')">static</xsl:when>
				<xsl:when test="not(starts-with(@name, 'jQuery.'))">instance</xsl:when>
			</xsl:choose>
		</xsl:attribute>
	</xsl:template>
	
	<xsl:template name="parameters">
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
					<!-- TODO part of the spec, but with a very different interpretation -->
					<options>
						<xsl:for-each select="../option">
							<option name="{@name}" datatype="{@type}">
								<description><xsl:value-of select="desc" /></description>
							</option>
						</xsl:for-each>
					</options>
				</parameter>
			</xsl:for-each>
		</parameters>
	</xsl:template>
	
	<xsl:template name="examples">
		<examples>
			<xsl:for-each select="example">
				<example>
					<description><xsl:value-of select="desc" /></description>
					<xsl:copy-of select="code|html|css" />
				</example>
			</xsl:for-each>
		</examples>
	</xsl:template>
	
</xsl:stylesheet>
